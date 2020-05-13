const jwt = require('jsonwebtoken');
require('../config/config');

const verifyToken = (req, res, next) => {//el next continua con la ejecucion del programa
    let token = req.get('Authorization');
    
    jwt.verify(token,process.env.SECRETWORD,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:"you must provide a token"
                }
            })
        }
        req.user = decoded.user;
        next();
    })
}

const verifyAdmin = (req, res, next) => {
    if(req.user.role!="ADMIN_ROLE"){
        res.status(500).json({
            ok:false,
            err:{
                message:"you don`t have permissions to perform this action"
            }
        })
    }else{
        next();
    }
}

const verifyTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token,process.env.SECRETWORD,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:"you must provide a token"
                }
            })
        }
        req.user = decoded.user;
        next();
    })
}

module.exports = {
    verifyToken,
    verifyAdmin,
    verifyTokenImg
}