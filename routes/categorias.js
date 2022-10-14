const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
} = require("../controllers/categorias");
const { existeCategoriaPorID } = require("../helpers/db-validators");
const { validarJWT, esAdminRole } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

//obtener todas las categorias - público
router.get("/", obtenerCategorias);

//obtener una categoria por ID - público
router.get(
  "/:id",
  [
    check("id", "No es un ID de mongo valido").isMongoId(),
    check("id").custom(existeCategoriaPorID),
    validarCampos,
  ],
  obtenerCategoria
);

//Crear categoria - privado - cualquier rol con token válido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//Actualizar - privado - cualquier rol con token válido
router.put("/:id",[
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id").custom(existeCategoriaPorID),
    validarCampos
] ,actualizarCategoria);

//Borrar - privado - ADMIN
router.delete("/:id",[
    validarJWT,
    esAdminRole,
    check("id", "No es un ID de mongo valido").isMongoId(),
    validarCampos,
    check("id").custom(existeCategoriaPorID),
    validarCampos
] ,borrarCategoria);

module.exports = router;
