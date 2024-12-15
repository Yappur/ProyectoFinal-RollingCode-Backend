const Turno = require("../models/turnos.schema");
const Producto = require("../models/producto.schema");
const Usuario = require("../models/usuarios.schema");

const crearTurno = async (req, res) => {
  try {
    const { usuario, fecha, hora, clase } = req.body;

    // Validar que los datos necesarios estén presentes
    if (!usuario || !fecha || !hora || !clase) {
      return res
        .status(400)
        .json({ mensaje: "Todos los campos son requeridos" });
    }

    // Validar que el usuario y la clase existan
    const usuarioExistente = await Usuario.findById(usuario);
    const claseExistente = await Producto.findById(producto);

    if (!usuarioExistente) {
      return res.status(404).json({ mensaje: "El usuario no existe" });
    }

    if (!claseExistente) {
      return res.status(404).json({ mensaje: "La clase no existe" });
    }

    // Crear el turno
    const nuevoTurno = new Turno({ usuario, fecha, hora, clase });
    await nuevoTurno.save();

    res
      .status(201)
      .json({ mensaje: "Turno creado exitosamente", turno: nuevoTurno });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear el turno", error: error.message });
  }
};
