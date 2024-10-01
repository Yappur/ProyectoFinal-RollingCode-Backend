const { response, request } = require("express");
const Producto = require("../models/producto.schema");

const obtenerProductos = async (req = request, res = response) => {
  const { _id } = req.query;
  try {
    const [total, productos] = await Promise.all([
      Producto.countDocuments(),
      Producto.find(_id).sort({ nombre: 1 }),
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
  const { idProducto } = req.params;
  const producto = await Producto.findById(idProducto);
  res.json({
    producto,
  });
};

const crearProducto = async (req = request, res = response) => {
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

const actualizarProducto = async (req = request, res = response) => {
  const { idProducto } = req.params;
  const { nombre, precio, categoria, descripcion, disponible, estado } =
    req.body;

  let data = {
    nombre,
    precio,
    descripcion,
    categoria,
    disponible,
    estado,
  };

  if (req.body.nombre) {
    data.nombre = req.body.nombre;
  }

  if (req.body.stock) {
    data.stock = req.body.stock;
  }
  if (req.body.img) {
    data.img = req.body.img;
  }

  const producto = await Producto.findByIdAndUpdate(idProducto, data, {
    new: true,
  });
  res.status(200).json(producto);
};

const borradoFisicodelProducto = async (req = request, res = response) => {
  const { idProducto } = req.params;

  try {
    const productoBorrado = await Producto.findOneAndDelete({
      _id: idProducto,
    });

    if (!productoBorrado) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.json({
      mensaje: "Producto eliminado",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al intentar borrar el producto",
    });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borradoFisicodelProducto,
};
