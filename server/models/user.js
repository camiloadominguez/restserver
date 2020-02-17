const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesVal = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un usuario valido'
}
let Schema = mongoose.Schema;

let userSchema = new Schema({
    name:{
        type:String,
        required:[true, "El nombre es necesario"],
    },
    email:{
        type:String,
        unique:true,
        required: [true,"El correo es necesario"]
    },
    password:{
        type:String,
        required:[true,"La contraseña es requerida"]
    },
    img:{
        type:String,
        required:false
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum: rolesVal
    },
    state:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
});

userSchema.methods.toJSON = function () {
    let usuario = this;
    let usuarioObjeto = usuario.toObject();

    delete usuarioObjeto.password;
    return usuarioObjeto;
}

userSchema.plugin(uniqueValidator, {message:'El {PATH} debe ser unico'});
module.exports = mongoose.model('User', userSchema)

