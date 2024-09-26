const { Router } = require("express");
const {
  crearUsuario,
  obtenerTodosLosUsuarios,
  obtenerUnUsuario,
  actualizarUnUsuario,
  borradoFisicoUsuario,
} = require("../controllers/usuarios.controllers");
const router = Router();

router.get("/", obtenerTodosLosUsuarios);
router.get("/:idUsuario", obtenerUnUsuario);

router.post("/", crearUsuario);
router.put("/:idUsuario", actualizarUnUsuario);

router.delete("/:idUsuario", borradoFisicoUsuario);

module.exports = router;
