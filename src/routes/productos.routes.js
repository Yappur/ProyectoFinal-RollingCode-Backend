const express = require("express");
const router = express.Router();

const {
  obtenerTodosLosProductos,
  obtenerUnProducto,
  crearUnProducto,
  actualizarUnProducto,
  borrarUnProducto,
  borradoFisicodelProducto,
} = require("../controllers/produtos.contollers");

/*Request - esto es la solicitud que me manda el cliente (front) al server (back)*/
/*Response: esto es la respuesta del servidor (back) al cliente (front)*/

/*GET - R - Read - Solo Obtener - Todos los productos*/
router.get("/", obtenerTodosLosProductos);
/*GET - Un Producto*/
router.get("/:idProducto", obtenerUnProducto);
/*POST - Crear un producto*/
router.post("/", crearUnProducto);
/*PUT - Actualizar un Producto */
router.put("/:idProducto", actualizarUnProducto);
/*DELETE - Borrado Fisico de un Producto*/
router.delete("/idProducto", borradoFisicodelProducto);

module.exports = router;
