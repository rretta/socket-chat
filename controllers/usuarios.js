const { response } = require("express");
const Usuario = require("../models/usuario")
const bcrypt = require("bcryptjs");



const usuariosGet = async (req, res=response) => {
   
    const {limite=5, desde=0} = req.query


    // const usuarios = await Usuario.find({estado:true})
    // .skip(Number(desde))    
    // .limit(Number(limite))
    
    // const total = await Usuario.countDocuments({estado:true});


    const [ total, usuarios ] = await Promise.all([
      Usuario.countDocuments({estado:true}),
      Usuario.find({estado:true})
        .skip(Number(desde))    
        .limit(Number(limite))
    ])


  res.json({
    total,
   usuarios
  });
};

const usuariosPut = async (req, res=response) => {
    const {id} = req.params;
    const {_id, password, google, correo, ...resto } = req.body;

    // TODO validar contra base de datos
    if(password){
      //Encriptar la contraseña
      const salt = bcrypt.genSaltSync(10)
  resto.password = bcrypt.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true})


  res.json(usuario);
};



const usuariosPost = async (req, res=response) => {

 

    const {nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({nombre, correo, password, rol})

   //Verificar si el correo existe
    

   //Encriptar contraseña
  const salt = bcrypt.genSaltSync(10)
  usuario.password = bcrypt.hashSync(password, salt)
   // Guardar en DB


    await usuario.save()

  res.json({
    msg: "post API - controlador",
    usuario
  });
};

const usuariosDelete = async (req, res=response) => {

  const {id} = req.params;
  const usuario = await Usuario.findByIdAndUpdate(id, {estado:false}, {new: true})
 


  res.json({
    usuario
  });
};

const usuariosPath = (req, res) => {
  res.json({
    msg: "patch API - controlador",
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosDelete,
  usuariosPath,
  usuariosPut
};
