const usuarios = [
  {
    id: 1,
    nombreUsuario: "Dalmiro20",
    contrasenia: 2020,
  },

  {
    id: 2,
    nombreUsuario: "Gerardo18",
    contrasenia: 1818,
  },

  {
    id: 3,
    nombreUsuario: "Matteo24",
    contrasenia: 2024,
  },
];

const obtenerUsuarios = () => {
  return {
    usuarios,
    statusCode: 200,
  };
};

const obtenerUsuario = (idUsuario) => {
  const usuario = usuarios.find((user) => user.id === Number(idUsuario));
  return {
    usuario,
    statusCode: 200,
  };
};

const nuevoUsuario = (body) => {
  const usuario = {
    id: usuarios[usuarios.length - 1]?.id + 1 || 1,
    ...body,
  };

  usuarios.push(usuario);

  return {
    msg: "Usuario creado con exito",
    statusCode: 201,
  };
};

const actualizarUsuario = (idUsuario, body) => {
  const posicionUsuario = usuarios.findIndex((user) => user.id == Number(id));

  const usuarioActualizado = {
    id: Number(idUsuario),
    ...body,
  };

  usuarios[posicionUsuario] = usuarioActualizado;

  return {
    msg: "Usuario actualizado",
    statusCode: 200,
  };
};

const borrarUsuario = (idUsuario) => {
  const posicionUsuario = usuarios.findIndex(
    (user) => user.id == Number(idUsuario)
  );

  usuarios.splice(posicionUsuario, 1);

  return {
    msg: "Usuario eliminado",
    statusCode: 200,
  };
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  nuevoUsuario,
  actualizarUsuario,
  borrarUsuario,
};
