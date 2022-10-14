const {response} = require("express")
const {Producto} = require("../models")


//obtenerCategorias - paginado - total -  populate
const obtenerProductos = async (req, res=response) =>{

    const {limite=5, desde=0} = req.query
    const [ total, productos ] = await Promise.all([
        Producto.countDocuments({estado:true}),
        Producto.find({estado:true})
            .populate("usuario", "nombre")
            .populate("categoria", "nombre")
          .skip(Number(desde))    
          .limit(Number(limite))
      ])

      res.json({
        total,
        productos
      });
}

//obtenerProducto  populate {}
const obtenerProducto = async (req, res=response) => {

    const {id} = req.params
    console.log(id)
    const product = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre")
    res.json(product)
}



const crearProducto = async (req, res=response) =>{

const {estado, usuario, ...body} = req.body;
const productoDB = await Producto.findOne({nombre: body.nombre})

if (productoDB){
    return res.status(400).json({
        msg: `El producto ${productoDB.nombre}, ya existe`
    })
}

const data = {
    ...body,
    nombre: body.nombre.toUpperCase(), 
    usuario: req.usuario._id
}

const producto = new Producto(data)

//guardar DB
await producto.save()


res.status(201).json(producto)



}


//actualizarCategoria  cambiar nombre
const actualizarProducto = async (req, res = response) =>{
const {id} = req.params;
const {estado, usuario, ...data} = req.body

if(data.nombre){
    
    data.nombre = data.nombre.toUpperCase();
}
    
data.usuario = req.usuario._id;

const producto = await Producto.findByIdAndUpdate(id, data, {new:true})

res.json(producto);

}


//borrarCategoria  cambia estado, no borra físico
const borrarProducto = async (req, res=response) =>{
    const {id} = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id,{estado: false},{new:true})

    res.status(200).json(productoBorrado);

 }



module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto

}