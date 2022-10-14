const path = require("path");
const fs = require("fs")
const { response } = require("express");

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { v4: uuidv4 } = require("uuid");
const { subirArchivo } = require("../helpers");
const {Usuario, Producto} = require("../models");
const { model } = require("mongoose");



const cargarArchivo = async (req, res = response) => {
  

  try {
    // const pathCompleto = await subirArchivo(req.files,["txt", "md"],"textos");
    const pathCompleto = await subirArchivo(req.files, undefined, "imgs");

    res.json({
      nombre: pathCompleto,
    });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};




const actualizarImagen = async(req, res=response)=>{




    const {id, coleccion} = req.params

    let modelo;


    switch (coleccion) {
        case "usuarios":
            modelo = await Usuario.findById(id)
            if(!modelo){
                res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

            case "productos":
                modelo = await Producto.findById(id)
                if(!modelo){
                    res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    })
                }
                break;
    
        default:
            return res.status(500).json({
                msg: "se me olvidó validar esto"
            })
            break;
    }
    //Limpiar imagenes previas


    if(modelo.img){
        //hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, "../uploads", coleccion,modelo.img);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    } 



    const pathCompleto = await subirArchivo(req.files, undefined, coleccion);
        modelo.img =  pathCompleto

        await modelo.save()

    res.json({
        modelo
    })

}





const actualizarImagenCloudinary = async(req, res=response)=>{




    const {id, coleccion} = req.params

    let modelo;


    switch (coleccion) {
        case "usuarios":
            modelo = await Usuario.findById(id)
            if(!modelo){
                res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

            case "productos":
                modelo = await Producto.findById(id)
                if(!modelo){
                    res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    })
                }
                break;
    
        default:
            return res.status(500).json({
                msg: "se me olvidó validar esto"
            })
            break;
    }
    //Limpiar imagenes previas


    if(modelo.img){

        const nombreArr = modelo.img.split("/");
        const nombre = nombreArr[nombreArr.length - 1 ]
        const [public_id] = nombre.split(".")
        cloudinary.uploader.destroy(public_id)
      //TODO:
    } 


    const {tempFilePath} = req.files.archivo
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

        modelo.img = secure_url

        await modelo.save()

    res.json(modelo)

}






const mostrarImagen = async (req, res=response) =>{


    const {id, coleccion} = req.params

    let modelo;


    switch (coleccion) {
        case "usuarios":
            modelo = await Usuario.findById(id)
            if(!modelo){
                res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

            case "productos":
                modelo = await Producto.findById(id)
                if(!modelo){
                    res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    })
                }
                break;
    
        default:
            return res.status(500).json({
                msg: "se me olvidó validar esto"
            })
            break;
    }
    //Limpiar imagenes previas


    if(modelo.img){
        //hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, "../uploads", coleccion,modelo.img);
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen)
        }
    } 


 const dummyImg= path.join(__dirname, "../assets/no-image.jpg")

return res.sendFile(dummyImg)

}

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary
  
};
