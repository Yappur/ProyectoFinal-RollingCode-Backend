const { Schema, model } = require("mongoose");
const ProductoSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
  },
  categoria: {
    type: String,
    default: "CrossFit",
  },
  precio: {
    type: Number,
    default: 0,
  },
  descripcion: {
    type: String,
  },
  disponible: {
    type: Boolean,
    default: true,
  },
  img: {
    type: String,
  },
  stock: {
    type: Number,
    default: 0,
  },
});

module.exports = model("Producto", ProductoSchema);
