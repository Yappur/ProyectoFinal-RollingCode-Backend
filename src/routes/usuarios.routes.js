const express = require("express");
const router = express.Router();

const {
  crearUsuario,
  obtenerTodosLosUsuarios,
  obtenerUnUsuario,
  actualizarUnUsuario,
  borradoFisicoUsuario,
} = require("../controllers/usuarios.controllers");

router.get("/listaUsuarios", obtenerTodosLosUsuarios);
router.get("/:idUsuario", obtenerUnUsuario);

router.post("/crearUsuario", crearUsuario);
router.put("/:idUsuario", actualizarUnUsuario);

router.delete("/:idUsuario", borradoFisicoUsuario);

module.exports = router;
