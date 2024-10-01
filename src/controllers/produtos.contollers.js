const serviciosProductos = require("../services/producto.services");
const { response, request } = require("express");
const Producto = require("../models/producto.schema");

const obtenerProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  try {
    const [total, productos] = await Promise.all([
      Producto.countDocuments(),
      Producto.find()
        .sort({ nombre: 1 })
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);
    res.json({
      total,
      productos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al obtener los productos",
    });
  }
};

const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id);
  res.json({
    producto,
  });
};

const productoPost = async (req = request, res = response) => {
  const { nombre, precio, categoria, descripcion, img, stock } = req.body;

  const productoDB = await Producto.findOne({ nombre });
  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre} ya existe`,
    });
  }

  const data = {
    nombre,
    categoria,
    precio,
    descripcion,
    img,
    stock,
  };
  const producto = new Producto(data);

  await producto.save();
  console.log(producto);
  res.status(201).json({
    msg: "Se agregó producto",
  });
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
  obtenerProductos,
  obtenerProducto,
  productoPost,
  actualizarUnProducto,
  borradoFisicodelProducto,
};
