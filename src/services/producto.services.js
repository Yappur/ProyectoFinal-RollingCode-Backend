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

const obtenerProductos = () => {
  return {
    productos,
    statusCode: 200,
  };
};

const obtenerProducto = (idProducto) => {
  const producto = productos.find((prod) => prod.id === Number(idProducto));
  return {
    producto,
    statusCode: 200,
  };
};

const nuevoProducto = async (body) => {
  const nuevoProducto = new ProductModel(body);
  console.log(nuevoProducto);
  /*const nuevoProducto = {
    id: productos[productos.length - 1]?.id + 1 || 1,
    ...body,
  };
  productos.push(nuevoProducto);
  */
  return {
    msg: "Producto creado con exito",
    statusCode: 201,
  };
};

const ActualizarProducto = (body, idProducto) => {
  const posicionProducto = productos.findIndex((prod) => prod.id == Number(id));

  const productoActualizado = {
    id: Number(idProducto),
    ...body,
  };

  productos[posicionProducto] = productoActualizado;

  return {
    msg: "Producto actualizado",
    statusCode: 200,
  };
};

const borrarProducto = (idProducto) => {
  const posicionProducto = productos.findIndex(
    (prod) => prod.id == Number(idProducto)
  );

  productos.splice(posicionProducto, 1);

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
