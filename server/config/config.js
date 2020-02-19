
// Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//DataBase

let urlDB

if(process.env.NODE_ENV==='dev'){
    urlDB='mongodb://localhost:27017/coffee'
}else{
    urlDB='mongodb+srv://Admin_coffee:D7Vehv7ahP3LUGH6@cluster0-g3jco.mongodb.net/test1'
}

process.env.URLDB=urlDB;