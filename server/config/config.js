
// Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vencimiento del token
// * 60 para que caduque en 1 minuto
// * 60 para que caduque en 1 hora
// * 24 para que caduque en 1 dia
// * 30 para que caduque en 1 mes

process.env.EXPIRATIONTOKEN = 1000 * 60 * 60 * 24;

//Seed de autenticacion

process.env.SECRETWORD = process.env.SECRETWORD || "secret-word-for-developers";

//DataBase

let urlDB

if(process.env.NODE_ENV==='dev'){
    urlDB='mongodb://localhost:27017/coffee'
}else{
    urlDB=process.env.MONGO_URI
}

process.env.URLDB=urlDB;

// google client ID

process.env.CLIENT_ID = process.env.CLIENT_ID || '923159377934-08n2gmvdk1e6jmkmfohvppiu02mksf70.apps.googleusercontent.com'
