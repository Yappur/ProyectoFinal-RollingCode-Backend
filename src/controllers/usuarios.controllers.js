const serviciosUsuarios = require("../services/usuarios.services");
const { request, response } = require("express");
const Usuario = require("../models/usuarios.schema");
const bcrypt = require("bcryptjs");

const obtenerTodosLosUsuarios = async (req, res) => {
  const result = await serviciosUsuarios.obtenerUnUsuarios();

  if (result.statusCode === 200) {
    res.status(200).json(result.usuarios);
  } else {
    res.status(500).json({ msg: "Error al traer los usuarios" });
  }
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
  const { idProducto } = req.params;
  const { nombreUsuario, emailUsuario, contrasenia, role } = req.body;

  const existeEmail = await Usuario.findOne({
    email,
    _id: { $ne: idProducto },
  });
  if (existeEmail) {
    return res.status(400).json({
      msg: `El correo ${emailUsuario} ya está registrado para otro usuario`,
    });
  }

  const usuarioActual = await Usuario.findById(idProducto);

  if (contrasenia && contrasenia.length < 8) {
    return res.status(400).json({
      msg: "La contraseña debe tener al menos 8 caracteres",
    });
  }
};

const salt = bcrypt.genSaltSync();
const hashedPassword = contrasenia
  ? bcrypt.hashSync(contrasenia, salt)
  : usuarioActual.contrasenia;

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
