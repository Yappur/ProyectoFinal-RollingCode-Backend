const serviciosUsuarios = require("../services/usuarios.services");

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

const crearUsuario = async (req, res) => {
  const result = await serviciosUsuarios.nuevoUsuario(req.body);

  if (result.statusCode === 201) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: "Error al crear el usuario" });
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
