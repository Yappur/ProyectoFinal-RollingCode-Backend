const serviciosUsuarios = require("../services/usuarios.services");

const obtenerTodosLosUsuarios = () => {
  const result = serviciosUsuarios.obtenerUnUsuarios();

  if (result.statusCode === 200) {
    res.status(200).json(result.usuarios);
  } else {
    res.status(500).json({ msg: "Error al traer los usuarios" });
  }
};

const obtenerUnUsuario = () => {
  const result = serviciosUsuarios.obtenerUnUsuarios(req.params.idUsuario);

  if (result.statusCode === 200) {
    res.status(200).json(result.usuario);
  } else {
    res.status(500).json({ msg: "Error al traer el usuario" });
  }
};

const crearUsuario = () => {
  const result = serviciosUsuarios.nuevoUsuario(req.body);

  if (result.statusCode === 201) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: "Error al crear el usuario" });
  }
};

const actualizarUnUsuario = () => {
  const result = serviciosUsuarios.actualizarUsuario(
    req.params.idUsuario,
    req.body
  );

  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: "Error al actualizar al usuario" });
  }
};

const borradoFisicoUsuario = () => {
  const result = serviciosUsuarios.borrarUsuario(req.params.idUsuario);

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
