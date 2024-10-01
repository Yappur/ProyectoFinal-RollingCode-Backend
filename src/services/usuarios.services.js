/*const usuarios = [
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
];*/

const UsersModel = require("../models/usuarios.schema");

const obtenerUsuarios = async () => {
  const usuario = await UsersModel.find();
  return {
    usuarios,
    statusCode: 200,
  };
};

const obtenerUsuario = async (idUsuario) => {
  const usuario = await UsersModel.findOne({ _id: idUsuario });
  return {
    usuario,
    statusCode: 200,
  };
};

const crearUsuario = async (body) => {
  const usuario = new UsersModel(body);
  await usuario.save();
  return {
    msg: "Usuario creado con exito",
    statusCode: 201,
  };
};

const actualizarUsuario = async (idUsuario, body) => {
  await UsersModel.findByIdAndUpdate({ _id: idUsuario }, body);
  return {
    msg: "Usuario actualizado",
    statusCode: 200,
  };
};

const borrarUsuario = async (idUsuario) => {
  await UsersModel.findOneAndDelete({ _id: idUsuario });
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
