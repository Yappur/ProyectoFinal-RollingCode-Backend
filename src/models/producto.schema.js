const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  titulo: {
    type: String,
    require: true,
    trim: true,
  },
  precio: {
    type: String,
    require: true,
  },
  descripcion: {
    type: String,
    require: true,
    trim: true,
  },
  imagen: {
    type: String,
    default: "" /*Imagen opcional*/,
    trim: true,
  },
});

const ProductModel = mongoose.model("product", ProductSchema);
module.exports = ProductModel;
