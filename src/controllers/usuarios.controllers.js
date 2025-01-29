const mongoose = require("mongoose");
const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuarios.schema");

const obtenerTodosLosUsuarios = async (req = request, res = response) => {
  try {
    const limite = Math.max(1, parseInt(req.query.limite) || 10); // Asegurar que limite sea al menos 1
    const desde = Math.max(0, parseInt(req.query.desde) || 0); // Asegurar que desde sea >= 0
    const query = { role: { $in: ["user", "admin"] }, bloqueado: false }; // Filtrar usuarios válidos

    const [total, usuarios] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query)
        .select("-contrasenia") // Excluye el campo de contraseña
        .sort({ nombre: 1 })
        .limit(limite)
        .skip(desde),
    ]);

    res.status(200).json({
      total, // Número total de usuarios
      usuarios, // Lista paginada de usuarios
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({
      mensaje: "Error al obtener usuarios",
      error: error.message,
    });
  }
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
  const { id } = req.params; // Cambiado de idUsuario a id para coincidir con el frontend

  try {
    // Verificar si el usuario existe antes de intentar borrarlo
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    // Realizar el borrado
    await Usuario.findByIdAndDelete(id);

    res.status(200).json({
      mensaje: "Usuario eliminado",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al intentar borrar el Usuario",
      error: error.message,
    });
  }
};

const inicioDeSesionUsuario = async (req, res) => {
  const { emailUsuario, contrasenia } = req.body;

  try {
    // Buscar el usuario por email
    const usuario = await Usuario.findOne({ emailUsuario });
    if (!usuario) {
      return res.status(400).json({ msg: "Email no encontrado" });
    }

    // Comparar la contraseña ingresada con el hash almacenado
    const esValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!esValida) {
      return res.status(401).json({ msg: "Credenciales incorrectas" });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: usuario._id, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
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
