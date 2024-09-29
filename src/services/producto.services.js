/*const productos = [
  {
    id: 1,
    nombre: "Funcional",
    precio: 10000,
  },

  {
    id: 2,
    nombre: "Spining",
    precio: 12000,
  },

  {
    id: 3,
    nombre: "Aparatos",
    precio: 15000,
  },

  {
    id: 4,
    nombre: "Allinclusive",
    precio: 30000,
  },
]; */
const ProductModel = require("../models/producto.schema");

const obtenerProductos = async () => {
  const productos = await ProductModel.find();
  return {
    productos,
    statusCode: 200,
  };
};

const obtenerProducto = async (idProducto) => {
  const producto = await ProductModel.findOne({ _id: idProducto });
  return {
    producto,
    statusCode: 200,
  };
};

const nuevoProducto = async (body) => {
  const nuevoProducto = new ProductModel(body);
  console.log(nuevoProducto);

  return {
    msg: "Producto creado con exito",
    statusCode: 201,
  };
};

const ActualizarProducto = async (body, idProducto) => {
  const productoActualizado = await ProductModel.findByIdAndUpdate(
    { _id: idProducto },
    body
  );
  console.log(
    productoActualizado
  ); /*Pasar al Frontend la respuesta de producto actualizado */

  return {
    msg: "Producto actualizado",
    statusCode: 200,
  };
};

const borrarProducto = async (idProducto) => {
  ProductModel.findByIdAndDelete({ _id: idProducto });

  return {
    msg: "Producto eliminado",
    statusCode: 200,
  };
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  nuevoProducto,
  ActualizarProducto,
  borrarProducto,
};
