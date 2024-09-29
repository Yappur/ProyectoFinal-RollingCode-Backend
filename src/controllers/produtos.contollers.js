const serviciosProductos = require("../services/producto.services");

const obtenerTodosLosProductos = async (req, res) => {
  const result = await serviciosProductos.obtenerProductos();

  if (result.statusCode === 200) {
    res.status(200).json(result.productos);
  } else {
    res.status(500).json({ msg: "Error al traer los productos" });
  }
};

const obtenerUnProducto = async (req, res) => {
  /*req: Request -> header - body - params - query */
  const result = await serviciosProductos.obtenerProducto(
    req.params.idProducto
  );
  if (result.statusCode === 200) {
    res.status(200).json(result.productos);
  } else {
    res.status(500).json({ msg: "Error al traer los productos" });
  }
};

const crearUnProducto = async (req, res) => {
  const result = await serviciosProductos.nuevoProducto(req.body);

  if (result.statusCode === 201) {
    res.status(201).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: "Error al traer los productos" });
  }
};

const actualizarUnProducto = async (req, res) => {
  const result = await serviciosProductos.actualizarProducto(
    req.body,
    req.params.idProducto
  );
  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: "Error al traer los productos" });
  }
};

const borradoFisicodelProducto = async (req, res) => {
  const result = await serviciosProductos.borrarProducto(req.params.idProducto);

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
