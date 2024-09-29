const { Schema, model } = require("mongoose");

const UsersSchema = new Schema({
  nombreUsuario: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  emailUsuario: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  contrasenia: {
    type: String,
    required: true,
    trim: true,
  },
  bloqueado: {
    type: Boolean,
    default: false,
  },
  rol: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
});

const UsersModel = model("user", UsersSchema);
module.exports = UsersModel;
