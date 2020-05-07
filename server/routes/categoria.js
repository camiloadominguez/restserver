const express = require('express')
const {verifyToken, verifyAdmin } = require('../controllers/authentication');
const app = express();

const Categoria = require('../models/categoria')


//mostrar todas la categorias

app.get('/categoria', verifyToken, (req,res)=>{
    Categoria.find({})
        .sort('descripcion')
        .populate('user', 'name email')
        .exec((err,categoriasDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            categoriasDB
        })
    })
})

app.get('/categoria/:id', verifyToken, (req,res)=>{
    let id = req.params.id;
    Categoria.findById(id,(err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                message:"No existe la categoria"
            })
        }
        res.json({
            categoriaDB
        })
    })
})
app.post('/categoria',verifyToken, (req,res)=>{
    let categoria = new Categoria({
        descripcion:req.body.descripcion,
        user:req.user._id
    })
    categoria.save((err, categoriaDB) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                message:"No existe la categoria"
            })
        }
        res.json({
            ok:true,
            categoria:categoriaDB
        })
    })
})
app.put('/categoria/:id',verifyToken, (req,res)=>{
    let id = req.params.id;
    let descripcion = req.body.descripcion
    Categoria.findByIdAndUpdate(id,{descripcion},{new:true, runValidators:true},(err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        
        res.json({
            ok:true,
            categoria:categoriaDB
        })
    })
})
app.delete('/categoria/:id',[verifyToken,verifyAdmin],(req,res)=>{
    Categoria.findByIdAndRemove(req.params.id,(err,categoriaEliminada)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(categoriaEliminada==undefined){
            return res.status(400).json({
                ok:false,
                err:{
                    message:"No se encontro la categoria"
                }
            })
        }
        res.status(200).json({
            ok:true,
            categoriaEliminada:categoriaEliminada
        })

    })
})
module.exports = app;