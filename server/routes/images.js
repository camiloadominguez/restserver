const express = require('express');
const fs = require('fs');
const path = require('path');
const {verifyTokenImg} = require('../controllers/authentication');
const app = express();

app.get('/imagen/:tipo/:img', verifyTokenImg, (req,res)=>{
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImage = path.resolve(__dirname,`../../upload/${tipo}/${img}`);
    
    if(fs.existsSync(pathImage)){
        res.sendFile(pathImage);
    }
    else{
        let pathDefault = path.resolve(__dirname,'../assets/not-found.jpg');
        res.sendFile(pathDefault)
    }
});

module.exports = app;