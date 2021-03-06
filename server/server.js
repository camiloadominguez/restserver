require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname,"./public")))

// app.use(require('./routes/index'));
app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB,{
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.catch(err => console.error(err))

mongoose.connection.once('open', _=>{
    console.log('Base de datos conectada');
})

mongoose.connection.on('error', err=>{
    console.log(err);
})

// await mongoose.connect('mongodb://localhost/my_database', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

app.listen(process.env.PORT, ()=>{
    console.log('Servidor corriendo en el puerto', process.env.PORT)
});