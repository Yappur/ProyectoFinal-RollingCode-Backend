const serviciosProductos = require("../services/producto.services");

const obtenerTodosLosProductos = (req, res) => {
  const result = serviciosProductos.obtenerProductos();
  if (result.statusCode === 200) {
    res.status(200).json(result.productos);
  } else {
    res.status(500).json({ msg: "Error al traer los productos" });
  }
};

const obtenerUnProducto = (req, res) => {
  /*req: Request -> header - body - params - query */
  const result = serviciosProductos.obtenerProducto(req.params.idProducto);
  if (result.statusCode === 200) {
    res.status(200).json(result.productos);
  } else {
    res.status(500).json({ msg: "Error al traer los productos" });
  }
};

const crearUnProducto = (req, res) => {
  const result = serviciosProductos.nuevoProducto(req.body);

  if (result.statusCode === 201) {
    res.status(201).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: "Error al traer los productos" });
  }
};

const actualizarUnProducto = (req, res) => {
  const result = serviciosProductos.actualizarProducto(
    req.body,
    req.params.idProducto
  );
  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: "Error al traer los productos" });
  }
};

const borradoFisicodelProducto = (req, res) => {
  const result = serviciosProductos.borrarProducto(req.params.idProducto);

  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: "Error al traer los productos" });
  }
};

module.exports = {
  obtenerTodosLosProductos,
  obtenerUnProducto,
  crearUnProducto,
  actualizarUnProducto,
  borradoFisicodelProducto,
};
