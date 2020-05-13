const fs = require('fs');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

//Todos los documentos que se carguen entran por el siguiente midleware
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req,res)=>{
    let tipo = req.params.tipo;
    let id = req.params.id;
    if(!req.files){
        return res.status(400).json({
            ok:false,
            err:{
                message:'No file selected'
            }
        })
    }

    let tipos = ['productos','usuarios'];
    if(tipos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            err:{
                message:`Los tipos permitidos son ${tipos.join(', ')}`
            }
        })
    }

    let archivo = req.files.archivo;
    let ext = archivo.name.split('.')[archivo.name.split('.').length-1]
    let extensiones = ['jpg','png','gif','jpeg'];

    if(extensiones.indexOf(ext)<0){
        return res.status(400).json({
            ok:false,
            err:{
                message:`Las extensiones permitidas son ${extensiones.join(', ')}`,
                ext
            }
        })
    }

    //Cambiar nombre del archivo
    let fileName = `${id}-${Math.floor(Math.random()*10000)}.${ext}`

    //subir archivos
    archivo.mv(`upload/${tipo}/${fileName}`,(err)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        switch(tipo){
            case 'usuarios':
                imgUser(id, res, fileName);
                break;
            case 'productos':
                imgProduct(id, res, fileName);
                break;
        }
    })
});

function imgUser(id, res, fileName){
    User.findById(id,(err,userDB)=>{
        if(err){
            deleteArchivo(fileName, 'usuarios');
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!userDB){
            deleteArchivo(fileName, 'usuarios');
            return res.status(400).json({
                ok:false,
                err:{
                    message:'User doesn´t exist'
                }
            })
        }
        
        deleteArchivo(userDB.img, 'usuarios');

        userDB.img = fileName;
        userDB.save((err, userDBSaved)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            res.json({
                ok:true,
                user:userDBSaved
            })
        })
    })
}

function imgProduct(id, res, fileName){
    Product.findById(id, (err, productDB)=>{
        if(err){
            deleteArchivo(fileName, 'productos');
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productDB){
            deleteArchivo(fileName, 'productos');
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Product doesnt exist'
                }
            })
        }
        deleteArchivo(productDB.img, 'productos');
        productDB.img = fileName;
        productDB.save((err, productSave)=>{
            if(err){
                deleteArchivo(productDB.img, 'productos');
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            res.json({
                ok:true,
                putProduct:productSave
            })
        })
    })
}

function deleteArchivo(nameImage, tipo){
    let pathImage = path.resolve(__dirname, `../../upload/${tipo}/${nameImage}`)
        if(fs.existsSync(pathImage)){
            fs.unlinkSync(pathImage);
        }
}

module.exports = app;