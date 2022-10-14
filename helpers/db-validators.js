const { Categoria, Usuario, Producto } = require("../models");
const Role = require("../models/role");


const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la BD`);
  }
};

const existeEmail = async (correo = "") => {
  const emailExistenteEnBase= await Usuario.findOne({ correo });
  if (emailExistenteEnBase) {
    throw new Error(`El mail ${correo} ya está registrado`);
    };
  }


  const existeUsuarioPorID = async ( _id) => {
    const existeUsuario= await Usuario.findById({ _id });
    if (!existeUsuario) {
      throw new Error(`El id ${_id} no existe`);
      };
    }

    const existeCategoriaPorID = async ( _id) => {
      const existeCategoria= await Categoria.findById({ _id });
      if (!existeCategoria) {
        throw new Error(`El id ${_id} no existe para la categoria`);
        };
      }

      const existeProductoPorID = async ( _id) => {
        const existeProducto= await Producto.findById({_id});

        if (!existeProducto) {
          throw new Error(`El id ${_id} no existe para el producto`);
          };
        }


        /**validar colecciones permitidas */
        const coleccionesPermitidas = (coleccion="", colecciones=[]) => {

          const incluidas = colecciones.includes(coleccion)
          if(!incluidas){
            throw new Error(`La coleccion ${coleccion} no es permitida - ${colecciones}`)
          }

          return true
        }

module.exports = {
  esRoleValido,
  existeEmail,
  existeUsuarioPorID,
  existeCategoriaPorID,
  existeProductoPorID,
  coleccionesPermitidas
};
