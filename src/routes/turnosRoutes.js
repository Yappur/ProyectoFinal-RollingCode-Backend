const express = require("express");
const router = express.Router();
const turnosController = require("../controllers/turnosController");
const verificarToken = require("../middlewares/verificarToken"); // Middleware del token

// Rutas protegidas
router.post("/", verificarToken, turnosController.crearTurno);
router.get("/", verificarToken, turnosController.obtenerTurnos);
router.get("/:id", verificarToken, turnosController.obtenerTurnoPorId);
router.put("/:id", verificarToken, turnosController.actualizarTurno);
router.delete("/:id", verificarToken, turnosController.eliminarTurno);

module.exports = router;
