const express = require('express');
const User = require('../models/user')
const app = express();
const bcrypt = require('bcrypt');
const _ =require('underscore');

app.get('/', (req , res)=>{
    res.json('Servidor creado')
});
app.get('/usuario',(req,res) => {

    let since = req.query.since || 5;
    since = Number(since);
    let until = req.query.until || 5;
    until = Number(until);
    console.log(req.query);
    User.find({state:true}, 'name email role state img ').skip(since).limit(until).exec((err , respUsers)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err:err
            });
        }
        User.count({state:true}, (err, numUsers)=>{
            res.json({
                ok:true,
                numUsers,
                respUsers:respUsers
            })
        })
    }) 
});
app.post('/usuario',(req,res) => {

    let body = req.body
    let user = new User({
        name:body.name,
        email:body.email,
        password:bcrypt.hashSync(body.password, 10),
        role:body.role
    })

    user.save((err, userDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                error:err
            })
        }
        res.json({
            ok:true,
            user:userDB
        });
    })
    // if(body.nombre===undefined){
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: "El nombre es necesario"
    //     })
    // }else{
    //     res.json({
    //         persona: body
    //     })
    // }
})
app.put('/usuario/:id',(req,res)=>{
    let id = req.params.id;
    let body = _.pick(req.body,['name','email','password','img','role','state']);
    User.findByIdAndUpdate(id, body,{new:true, runValidators:true},(err,userDB) => {
        if(err){
            return res.status(400).json({
                ok:true,
                err:err
            })
        }
        res.json({
            ok:true,
            user:userDB
        })
    });
    
});
app.delete('/usuario/:id',(req,res)=>{
    let id = req.params.id;
    User.findByIdAndUpdate(id, { state:false }, {new:true}, (err, delUser)=>{
        
    // User.findByIdAndRemove(id, (err, delUser)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        if(delUser===null){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El usuario no existe en la base de datos'
                }
            })
        }
        res.json({
            ok:true,
            user:delUser
        })
    })
});

module.exports = app;