const mongoose = require("mongoose");

const TurnoSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId, // Relacionado con la colección de usuarios
      ref: "Usuario",
      required: [true, "El usuario es obligatorio"],
    },
    fecha: {
      type: Date,
      required: [true, "La fecha es obligatoria"],
    },
    hora: {
      type: String, // Puedes usar formatos como "HH:mm"
      required: [true, "La hora es obligatoria"],
    },
    clase: {
      type: mongoose.Schema.Types.ObjectId, // Relacionado con la colección de clases
      ref: "Producto",
      // enum: ["CrossFit", "Pilates", "Funcional"],
      required: [true, "La clase es obligatoria"],
    },
  },
  {
    timestamps: true, // Agrega automáticamente campos de creación y actualización
  }
);

module.exports = mongoose.model("Turno", TurnoSchema);
