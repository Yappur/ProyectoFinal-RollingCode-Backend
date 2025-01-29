const express = require("express");
const router = express.Router();

const {
  crearUsuario,
  obtenerTodosLosUsuarios,
  obtenerUnUsuario,
  actualizarUnUsuario,
  borradoFisicoUsuario,
  inicioDeSesionUsuario,
} = require("../controllers/usuarios.controllers");

router.get("/listaUsuarios", obtenerTodosLosUsuarios);
router.get("/:idUsuario", obtenerUnUsuario);
router.post("/crearUsuario", crearUsuario);
router.put("/:idUsuario", actualizarUnUsuario);

router.post("/iniciarSesion", inicioDeSesionUsuario);

router.delete("/borrado/:id", borradoFisicoUsuario);

module.exports = router;
