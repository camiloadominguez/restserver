const {Schema, model} = require('mongoose');
const productSchema = new Schema({
    name:{
        type:String,
        required:[true,'El nombre es requerido']
    },
    precioUni:{
        type:String,
        required:[true, 'El precio unitario es requerido']
    },
    descripcion:String,
    disponible:{
        type:Boolean,
        required:true,
        default:true
    },
    categoria:{
        type:Schema.Types.ObjectId,
        ref:'Categoria',
        required:true
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = model('Product', productSchema);