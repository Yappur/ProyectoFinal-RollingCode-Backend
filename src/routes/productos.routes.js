const express = require("express");
const router = express.Router();
const clasesController = require("../controllers/produtos.contollers");

router.get("/listaClases", clasesController.obtenerClases);
router.get("/:idClase", clasesController.obtenerClase);
router.post("/crearClase", clasesController.crearClase);
router.post("/pagarClase", clasesController.pagarClase);
router.put("/:idClase", clasesController.actualizarClase);
router.delete("/:idClase", clasesController.borradoFisicoDeLaClase);

module.exports = router;
