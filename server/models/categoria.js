const {Schema, model} = require('mongoose')

const categoriaSchema = new Schema({
    descripcion:{
        type:String,
        unique:true,
        required:true,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = model('Categoria',categoriaSchema)