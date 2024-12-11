const mongoose = require("mongoose");
const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
    // Verificar la longitud de la contraseña
    if (!contrasenia || contrasenia.length < 8) {
      return res.status(400).json({
        msg: "La contraseña debe tener al menos 8 caracteres",
      });
    }

    // Verificar si el correo ya existe
    const existeEmail = await Usuario.findOne({ emailUsuario });
    if (existeEmail) {
      return res.status(400).json({
        msg: `El correo ${emailUsuario} ya está registrado`,
      });
    }

    // Encriptar la contraseña antes de guardar
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(contrasenia, salt);

    // Crear un nuevo usuario con los datos proporcionados
    const usuario = new Usuario({
      nombreUsuario,
      emailUsuario,
      contrasenia: hashedPassword, // Usar la contraseña encriptada
      role,
    });

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
      error: error.message,
    });
  }
};

// actualizar un usuario
const actualizarUnUsuario = async (req = request, res = response) => {
  const { idUsuario } = req.params;
  const { nombreUsuario, emailUsuario, contrasenia, role } = req.body;

  try {
    // Verificar si el correo ya está registrado en otro usuario
    const existeEmail = await Usuario.findOne({
      emailUsuario,
      _id: { $ne: idUsuario },
    });

    if (existeEmail) {
      return res.status(400).json({
        msg: `El correo ${emailUsuario} ya está registrado para otro usuario`,
      });
    }

    // Obtener el usuario actual para mantener los datos que no se van a actualizar
    const usuarioActual = await Usuario.findById(idUsuario);
    if (!usuarioActual) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Validar la longitud de la contraseña si se actualiza
    if (contrasenia && contrasenia.length < 8) {
      return res.status(400).json({
        msg: "La contraseña debe tener al menos 8 caracteres",
      });
    }

    // Preparar los datos para la actualización
    let data = {
      nombreUsuario: nombreUsuario || usuarioActual.nombreUsuario,
      emailUsuario: emailUsuario || usuarioActual.emailUsuario,
      contrasenia: contrasenia || usuarioActual.contrasenia,
      role: role || usuarioActual.role,
    };

    // Actualizar el usuario
    const usuario = await Usuario.findByIdAndUpdate(idUsuario, data, {
      new: true,
    });

    res.status(200).json({
      message: "Usuario actualizado",
      usuario,
    });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
};

// borrar un usuario
const borradoFisicoUsuario = async (req = request, res = response) => {
  const { idUsuario } = req.params;

  try {
    const usuarioBorrado = await Usuario.findOneAndDelete({
      _id: idUsuario,
    });

    if (!usuarioBorrado) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    res.json({
      mensaje: "Usuario eliminado",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al intentar borrar el Usuario",
    });
  }
};

const inicioDeSesionUsuario = async (req, res) => {
  const { emailUsuario, contrasenia } = req.body;

  try {
    // Buscar el usuario por nombre de usuario
    const usuario = await Usuario.findOne({ emailUsuario });
    if (!usuario) {
      return res.status(400).json({ msg: "email no encontrado" });
    }

    // Comparar la contraseña ingresada con el hash en la base de datos
    const esValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!esValida) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    // Generar el token
    const token = jwt.sign(
      { id: usuario._id, role: usuario.role },
      "tuClaveSecreta",
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      msg: "Inicio de sesión exitoso",
      token,
      role: usuario.role,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

module.exports = {
  obtenerTodosLosUsuarios,
  obtenerUnUsuario,
  crearUsuario,
  actualizarUnUsuario,
  borradoFisicoUsuario,
  inicioDeSesionUsuario,
};
