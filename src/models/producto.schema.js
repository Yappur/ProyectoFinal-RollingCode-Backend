const { Schema, model } = require("mongoose");
const ClaseSchema = Schema({
  nombreClase: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  descripcion: {
    type: String,
    required: [true, "La descripción es obligatoria"],
  },
  categoria: {
    type: String,
    default: "CrossFit",
  },

  disponible: {
    type: Boolean,
    default: true,
  },
  img: {
    type: String,
  },
});

module.exports = model("Clase", ClaseSchema);
