const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');   


const crearUsuario = async (req, res = response) => {

    const { email, name, password } = req.body;
    
    try {
        //Verifiar email
        const usuario = await Usuario.findOne({ email });

        if( usuario ){
            return res.status(400).json({
                ok:false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        //Crear usuario con el modelo
        const dbUser = new Usuario( req.body );

        // Hash Contraseña
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt );

        const token = await generarJWT( dbUser.id, name );
        await dbUser.save();

        return res.status(201).json({
            ok:true,
            uid: dbUser.id,
            name, 
            token
        });

        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg:'Por favor hable con el administrador'
        });
    }
}

const loginUsuario = async (req, res = response) => {

   
    const { email, password } = req.body;

    try {

        const dbUser = await Usuario.findOne({ email });
        
        if( !dbUser ){
            
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no registrado'
            })    
        }

        //Validar si password hace match
        const validPassword = bcrypt.compareSync( password, dbUser.password );

        if( !validPassword ){
            
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña es incorrecta'
            }) 
        }

        //Generar JWT
        const token = await generarJWT( dbUser.id, dbUser.name );
        //Respuesta
        return res.json({
            ok: true,
            uid: dbUser.id,
            name:dbUser.name,
            token
        }) 

        
    } catch (error) {
        console.log(error);
        return res.status().json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }
    
}

const revalidarToken = async (req, res = response) => {


    const { uid, name } = req;
    
    //Generar JWT
    const token = await generarJWT( uid, name );

    return res.json({
        ok:true,
        uid,
        token,
        name
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}