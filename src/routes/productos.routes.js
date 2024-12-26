const express = require("express");
const router = express.Router();

const {
  obtenerClases,
  obtenerClases,
  crearClase,
  actualizarClase,
  borradoFisicoDeLaClase,
} = require("../controllers/produtos.contollers");

router.get("/listaProductos", obtenerClases);
router.get("/:idProducto", obtenerClases);
router.post("/crearProducto", crearClase);
router.put("/:idProducto", actualizarClase);
router.delete("/:idProducto", borradoFisicoDeLaClase);

module.exports = router;
