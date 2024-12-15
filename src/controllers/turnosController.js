const Turno = require("../models/turnos.schema");
const Producto = require("../models/producto.schema");
const crearTurno = async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // ID del usuario extraído del token
    const { fecha, hora, clase } = req.body;

    // Validar que los datos necesarios estén presentes
    if (!fecha || !hora || !clase) {
      return res
        .status(400)
        .json({ mensaje: "Todos los campos son requeridos" });
    }

    // Validar que la clase exista
    const claseExistente = await Producto.findById(clase);
    if (!claseExistente) {
      return res.status(404).json({ mensaje: "La clase no existe" });
    }

    // Crear el turno
    const nuevoTurno = new Turno({
      usuario: usuarioId, // Asignar el usuario desde el token
      fecha,
      hora,
      clase,
    });

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
