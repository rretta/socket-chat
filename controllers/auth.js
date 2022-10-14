const {response, json} = require("express")
const Usuario = require("../models/usuario")
const bcryptjs = require("bcryptjs")
const { generarJWT } = require("../helpers/generarJST")
const { googleVerify } = require("../helpers/google-verify")



const login = async (req, res=response) => {
    const { correo, password} = req.body


    try {


        //Ver si el email existe
        const usuario = await Usuario.findOne({correo})

        if (!usuario){
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - correo"
            })
        }

        //validar si el usuario está activo
        if (!usuario.estado){
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - estado: false"
            })
        }
        //verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)

        if(!validPassword){
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - pass: incorrecta"
            })
        }

        //generar jwt
        const token = await generarJWT(usuario.id);
        //ver si el usuario está dentro de base de datos




        res.json({
            usuario, token
            
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Hable con el administrador"
        })
    }




   
}


const googleSignIn= async (req, res=response) =>{

    const {id_token} = req.body;

try {
    const {correo, nombre, img} = await googleVerify(id_token)

   
    //comprar referencia de correo

    let usuario = await Usuario.findOne({correo});


    if(!usuario){
        //tengo que crearlo
        const data = {
            nombre,
            correo,
            password: ";P",
            img,
            rol: "USER_ROLE",
            google: true,
          };
       usuario = new Usuario(data)
        await usuario.save()
    }


    //si el usuario dentro de DB  fue eliminado

    if(!usuario.estado){
        return res.status(401).json({
            msg: "Hable con el administrador - usuario bloqueado"
        })
    }

    //generar jsonwebtoken
    const token = await generarJWT(usuario.id);



    res.json({
      usuario, 
      token
    })


} catch (error) {
    res.status(400).json({
        ok: false,
        msg: "El token no se pudo verificar"
    })
}

}

const renovarToken = async (req, res=response)=>{

const {usuario} = req;
  //generar jsonwebtoken
  const token = await generarJWT(usuario.id);
res.json({
    usuario,
    token
})
}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}