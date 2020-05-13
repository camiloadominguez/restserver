const express = require('express');
const _ = require('underscore');

const Product = require('../models/product');

const { verifyToken } = require('../controllers/authentication')

const app = express();

//Todos los productos paginado

app.get('/producto', verifyToken, (req,res)=>{

    Product.countDocuments({disponible:true},(err,cantidad)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        let since = req.query.desde || 0;
        since = Number(since);
        let quantity = req.query.cantidad || cantidad;
        quantity = Number(quantity);
        console.log(since,quantity);
        Product.find({disponible:true})
            .skip(since)
            .limit(quantity)
            .populate('usuario', 'email name')
            .populate('categoria','descripcion')
            .exec((err, productos)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            if(!productos){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:'no existe ningun producto'
                    }
                })
            }
            res.json({
                ok:true,
                productos:productos
            })
        })
    })
})

//un solo producto

app.get('/producto/:id', verifyToken, (req,res)=>{
    let id = req.params.id;
    Product.findById(id)
        .populate('usuario', 'email name')
        .populate('categoria','descripcion')
        .exec((err,productoDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'No se necontro el producto'
                }
            })
        }
        res.json({
            ok:true,
            producto:productoDB
        })
    })
})

//Buscar productos

app.get('/producto/buscar/:termino',(req,res)=>{
    let termino = req.params.termino;
    let regex = new RegExp(termino,'i')
    Product.find({descripcion:regex},(err,products)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            products:products
        })
    })
})

//crea productos
app.post('/producto', verifyToken , (req, res)=>{
    let body = req.body;
    let product = new Product({
        name        :   body.name,
        precioUni   :   body.precio,
        descripcion :   body.descripcion,
        disponible  :   body.disponible,
        categoria   :   body.categoria,
        usuario     :   req.user._id
    })
    product.save((err, savedProduct)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!savedProduct){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'no se creo el producto'
                }
            })
        }
        res.json({
            ok:true,
            message:'se creo el producto',
            producto:savedProduct
        })
    });
})

app.put('/producto/:id', verifyToken, (req,res)=>{
    let id = req.params.id;
    let putProduct = _.pick(req.body,["name","precioUni","descripcion","disponible","categoria"]);
    // let {name, precio, descripcion, disponible, categoria} = req.body;
    Product.findByIdAndUpdate(id,putProduct,{new:true},(err,updateProduct)=>{
        if(err){
            return res.status(500).json({
                ok:true,
                err
            })
        }
        if(!updateProduct){
            return res.status(400).json({
                ok:true,
                err:{
                    message:"No se encuentra el producto a actualizar"
                }
            })
        }
        res.json({
            ok:true,
            message: 'El producto ha sido actualizado con exito',
            producto:updateProduct
        })
    })
})

app.delete('/producto/:id', verifyToken, (req,res)=>{
    let id = req.params.id;
    Product.findByIdAndUpdate(id,{disponible:req.body.disponible},{new:true},(err,disableProduct)=>{
        if(err){
            return res.status(500).json({
                ok:true,
                err
            })
        }
        if(!disableProduct){
            return res.status(400).json({
                ok:true,
                err:{
                    message:"no se encontro el producto"
                }
            })
        }
        res.json({
            ok:true,
            message:"El producto ha sido desabilitado",
            producto:disableProduct
        })

    })
})


module.exports = app;