const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos");

const { existeProductoPorID, existeCategoriaPorID } = require("../helpers/db-validators");
const { validarJWT, esAdminRole } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.get("/", obtenerProductos);

//obtener una producto por ID - público
router.get("/:id",[
    check("id", "No es un ID de mongo valido").isMongoId(),
    check("id").custom(existeProductoPorID),
    validarCampos,
  ],
  obtenerProducto
);

//Crear producto - privado - cualquier rol con token válido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "No es un id de MongoDB").isMongoId(),
    check("categoria").custom(existeCategoriaPorID),
    validarCampos,
  ],
  crearProducto
);


//Actualizar - privado - cualquier rol con token válido
router.put("/:id",[
    validarJWT,
    check("id").custom(existeProductoPorID),
    validarCampos
] ,actualizarProducto);

//Borrar - privado - ADMIN
router.delete("/:id",[
    validarJWT,
    esAdminRole,
    check("id", "No es un ID de mongo valido").isMongoId(),
    validarCampos,
    check("id").custom(existeProductoPorID),
    validarCampos
] ,borrarProducto);




module.exports = router;
