const express = require("express");
const router = express.Router();
const turnosController = require("../controllers/turnosController");
const verificarToken = require("../middlewares/auth"); // Middleware del token

// Rutas protegidas

router.get("/", verificarToken, turnosController.obtenerTurnos);
router.post("/crearTurno", verificarToken, turnosController.crearTurno);
router.get("/testTurno", verificarToken, turnosController.testTurno);
router.get("/:id", verificarToken, turnosController.obtenerTurnoPorId);
router.put("/:id", verificarToken, turnosController.actualizarTurno);
router.delete("/:id", verificarToken, turnosController.eliminarTurno);

module.exports = router;
