const express = require("express");
const router = express.Router();

router.get("/productos", (req, res) => {
  res.json(productos);
});
router.get("/:idProducto", (req, res) => {
  const nuevoProducto = {
    id: productos[productos.length - 1]?.id + 1 || 1,
    ...req.body,
  };
  productos.push(nuevoProducto);
  res.json(nuevoProducto);
});
router.post("/", (req, res) => {
  res.json(productos);
});

module.exports = router;

/*Agregar Delete y put 41min*/
/*quedamos en el min 45 con gerardo*/
