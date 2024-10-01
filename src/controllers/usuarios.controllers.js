const { request, response } = require("express");
const Usuario = require("../models/usuarios.schema");

const obtenerTodosLosUsuarios = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { role: { $in: ["user", "admin"] }, bloqueado: false };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).sort({ nombre: 1 }).limit(limite).skip(desde),
  ]);

  res.status(200).json({
    total,
    usuarios,
  });
};
const obtenerUnUsuario = async (req, res) => {
  const result = await serviciosUsuarios.obtenerUnUsuarios(
    req.params.idUsuario
  );

  if (result.statusCode === 200) {
    res.status(200).json(result.usuario);
  } else {
    res.status(500).json({ msg: "Error al traer el usuario" });
  }
};

const crearUsuario = async (req = request, res = response) => {
  const { nombreUsuario, emailUsuario, contrasenia, role } = req.body;

  try {
    // Crear un nuevo usuario con los datos proporcionados
    const usuario = new Usuario({
      nombreUsuario,
      emailUsuario,
      contrasenia,
      role,
    });

    // Verificar si el correo ya existe
    const existeEmail = await Usuario.findOne({ emailUsuario });
    if (existeEmail) {
      return res.status(400).json({
        msg: `El correo ${emailUsuario} ya está registrado`,
      });
    }

    // Guardar el usuario en la base de datos
    await usuario.save();

    res.status(201).json({
      message: "Usuario creado",
      usuario,
    });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return res.status(500).json({
      msg: "Error interno del servidor",
      error: error.message, // Muestra el mensaje de error para diagnosticar mejor
    });
  }
};
const actualizarUnUsuario = async (req, res) => {
  const result = await serviciosUsuarios.actualizarUsuario(
    req.params.idUsuario,
    req.body
  );

  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: "Error al actualizar al usuario" });
  }
};

const borradoFisicoUsuario = async (req, res) => {
  const result = await serviciosUsuarios.borrarUsuario(req.params.idUsuario);

  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: "Error al borrar al usuarios" });
  }
};

module.exports = {
  obtenerTodosLosUsuarios,
  obtenerUnUsuario,
  crearUsuario,
  actualizarUnUsuario,
  borradoFisicoUsuario,
};
