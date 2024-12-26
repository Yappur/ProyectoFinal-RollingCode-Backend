const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs"); // Importar bcrypt para la encriptación de contraseñas

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

// Método para comparar contraseñas (usando bcrypt)
UsersSchema.methods.compararContrasenia = async function (contrasenia) {
  return bcrypt.compare(contrasenia, this.contrasenia); // Comparar la contraseña ingresada con la encriptada
};

// Encriptar la contraseña antes de guardarla en la base de datos
UsersSchema.pre("save", async function (next) {
  if (!this.isModified("contrasenia")) return next(); // Solo encriptar si la contraseña ha sido modificada
  this.contrasenia = await bcrypt.hash(this.contrasenia, 10); // Encriptar la contraseña con bcrypt
  next();
});

module.exports = model("Usuario", UsersSchema);
