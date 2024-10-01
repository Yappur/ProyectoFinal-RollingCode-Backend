const { Schema, model } = require("mongoose");

const UsersSchema = new Schema({
  nombreUsuario: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
    unique: true,
  },
  emailUsuario: {
    type: String,
    required: [true, "El correo es obligatorio"],
    trim: true,
    unique: true,
  },
  contrasenia: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
    trim: true,
  },
  bloqueado: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
});

UsersSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

const UsersModel = model("user", UsersSchema);
module.exports = UsersModel;
