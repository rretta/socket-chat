const { Router } = require("express");
const {check} = require("express-validator")


const {
  validarCampos, validarJWT, esAdminRole, tieneRole 
} = require("../middlewares")


const { esRoleValido, existeEmail, existeUsuarioPorID} = require("../helpers/db-validators");
const {
  usuariosGet,
  usuariosPost,
  usuariosPath,
  usuariosDelete,
  usuariosPut,
} = require("../controllers/usuarios");



const router = Router();

router.get("/", usuariosGet);

router.put("/:id",[
  check("id", "No es un id Válido").isMongoId(),
  check("id").custom(existeUsuarioPorID),
  check("rol").custom(esRoleValido),
  validarCampos
], usuariosPut);

//al medio va el middleware
router.post("/", [
  check("nombre", "El nombre es obligatorio").not().isEmpty(),
  check("password", "El password debe de ser de mas de 6 digitos").isLength({min: 6}),
  check("correo").custom(existeEmail),
  check("correo", "El correo no es valido").isEmail(),
  // check("rol", "No es un rol valido").isIn(["ADMIN_ROLE", "USER_ROLE"])
  check("rol").custom(esRoleValido),
  validarCampos
] ,usuariosPost);

router.delete("/:id",[
  validarJWT,
  tieneRole("ADMIN_ROL", "VENTAS_ROL"),
  check("id", "No es un id Válido").isMongoId(),
  check("id").custom(existeUsuarioPorID),
  validarCampos
] , usuariosDelete);

router.patch("/", usuariosPath);

module.exports = router;
