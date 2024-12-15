const mongoose = require("mongoose");

const TurnoSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId, // Relacionado con la colección de usuarios
      ref: "Usuario",
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    hora: {
      type: String, // Puedes usar formatos como "HH:mm"
      required: true,
    },
    clase: {
      type: mongoose.Schema.Types.ObjectId, // Relacionado con la colección de clases
      ref: "Clase",
      enum: ["CrossFit", "Pilates", "Funcional"],
      required: true,
    },
  },
  {
    timestamps: true, // Agrega automáticamente campos de creación y actualización
  }
);

module.exports = mongoose.model("Turno", TurnoSchema);
