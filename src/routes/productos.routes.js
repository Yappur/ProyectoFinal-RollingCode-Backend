const express = require("express");
const router = express.Router();

const {
  obtenerProductos,
  obtenerProducto,
  productoPost,
  actualizarProducto,
  borrarUnProducto,
  borradoFisicodelProducto,
} = require("../controllers/produtos.contollers");

/*Request - esto es la solicitud que me manda el cliente (front) al server (back)*/
/*Response: esto es la respuesta del servidor (back) al cliente (front)*/

/*GET - R - Read - Solo Obtener - Todos los productos*/
router.get("/listaProductos", obtenerProductos);
/*GET - Un Producto*/
router.get("/:idProducto", obtenerProducto);
/*POST - Crear un producto*/
router.post("/crearProducto", productoPost);
/*PUT - Actualizar un Producto */
router.put("/:idProducto", actualizarProducto);
/*DELETE - Borrado Fisico de un Producto*/
router.delete("/idProducto", borradoFisicodelProducto);

module.exports = router;
