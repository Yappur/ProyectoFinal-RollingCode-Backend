const mongoose = require("mongoose");
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
const obtenerUnUsuario = async (req = request, res = response) => {
  const { idUsuario } = req.params;

  console.log("ID recibido:", idUsuario); // Verificar el ID que llega

  try {
    if (!mongoose.Types.ObjectId.isValid(idUsuario)) {
      console.error("ID no válido:", idUsuario); // Mostrar el ID inválido en la consola
      return res.status(400).json({ msg: "El ID proporcionado no es válido" });
    }

    const usuario = await Usuario.findById(idUsuario);

    if (!usuario) {
      console.error("Usuario no encontrado con ID:", idUsuario);
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res
      .status(500)
      .json({ msg: "Error al traer el usuario", error: error.message });
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

// actualizar un usuario
const actualizarUnUsuario = async (req, res) => {
  const { idUsuario } = req.params;
  const { nombreUsuario, emailUsuario, contrasenia, role } = req.body;

  const existeEmail = await Usuario.findOne({
    emailUsuario,
    _id: { $ne: idUsuario },
  });
  if (existeEmail) {
    return res.status(400).json({
      msg: `El correo ${email} ya está registrado para otro usuario`,
    });
  }

  const usuarioActual = await Usuario.findById(id);

  if (password && password.length < 8) {
    return res.status(400).json({
      msg: "La contraseña debe tener al menos 8 caracteres",
    });
  }

  const salt = bcrypt.genSaltSync();
  const hashedPassword = password
    ? bcrypt.hashSync(password, salt)
    : usuarioActual.password;

  const updatedRole = role || usuarioActual.role;

  let data = {
    name: name || usuarioActual.name,
    email,
    password: hashedPassword,
    role: updatedRole,
  };

  const usuario = await Usuario.findByIdAndUpdate(id, data, { new: true });

  res.status(200).json({
    message: "Usuario actualizado",
    usuario,
  });
};
// borrar un usuario
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
