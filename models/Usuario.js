const { Schema, model } = require("mongoose");


const UsuarioSchema = Schema({
    name:{
        type: String,
        requred:true
    },
    email:{
        type: String,
        requred:true,
        unique: true
    },
    password:{
        type: String,
        requred:true
    },

});

module.exports = model('Usuario', UsuarioSchema );