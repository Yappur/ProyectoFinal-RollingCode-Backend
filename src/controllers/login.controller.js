const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario"); // Este es tu modelo de Usuario

// Función para generar el token JWT
const generarToken = (usuarioId) => {
  return jwt.sign({ id: usuarioId }, process.env.JWT_SECRET, {
    expiresIn: "5h", // El token expirará en una hora, puedes ajustar este valor
  });
};

// Función para manejar el login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario en la base de datos por su email
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      // Si no existe el usuario con ese email, respondemos con un error
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    // Verificar la contraseña, asumiendo que usas bcrypt para encriptar la contraseña
    const esValida = await usuario.compararContrasenia(contrasenia); // Comparar con la contraseña almacenada en la DB

    if (!esValida) {
      // Si la contraseña es incorrecta, respondemos con un error
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });
    }

    // Si todo es correcto, generamos el token
    const token = generarToken(usuario._id); // Generamos el token con el ID del usuario

    // Respondemos con el token generado
    res.json({
      mensaje: "Autenticación exitosa",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al autenticar usuario" });
  }
};

module.exports = {
  login,
};
