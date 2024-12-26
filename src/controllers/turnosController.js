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

const obtenerTurnos = async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // ID del usuario extraído del token

    const turnos = await Turno.find({ usuario: usuarioId }) // Filtrar turnos por usuario
      .populate("clase", "nombre descripcion") // Información de la clase
      .sort({ fecha: 1, hora: 1 }); // Ordenar por fecha y hora

    res.status(200).json(turnos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener los turnos", error: error.message });
  }
};

const obtenerTurnoPorId = async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // ID del usuario extraído del token
    const { id } = req.params; // ID del turno a buscar

    // Buscar el turno con el ID y verificar que pertenece al usuario autenticado
    const turno = await Turno.findOne({ _id: id, usuario: usuarioId })
      .populate("clase", "nombre descripcion") // Opcional: traer información de la clase
      .exec();

    if (!turno) {
      return res
        .status(404)
        .json({ mensaje: "Turno no encontrado o no pertenece al usuario" });
    }

    res.status(200).json(turno);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el turno", error: error.message });
  }
};

const actualizarTurno = async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // ID del usuario extraído del token
    const { id } = req.params; // ID del turno a actualizar
    const { fecha, hora, clase } = req.body; // Datos a actualizar

    // Validar si se incluye un ID de clase y verificar que existe
    if (clase) {
      const claseExistente = await Clase.findById(clase);
      if (!claseExistente) {
        return res
          .status(404)
          .json({ mensaje: "La clase especificada no existe" });
      }
    }

    // Buscar y actualizar el turno solo si pertenece al usuario autenticado
    const turnoActualizado = await Turno.findOneAndUpdate(
      { _id: id, usuario: usuarioId }, // Filtro: turno y usuario deben coincidir
      { fecha, hora, clase }, // Campos a actualizar
      { new: true, runValidators: true } // Opciones: devolver el turno actualizado y validar datos
    );

    if (!turnoActualizado) {
      return res
        .status(404)
        .json({ mensaje: "Turno no encontrado o no pertenece al usuario" });
    }

    res
      .status(200)
      .json({
        mensaje: "Turno actualizado exitosamente",
        turno: turnoActualizado,
      });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al actualizar el turno", error: error.message });
  }
};

const eliminarTurno = async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // ID del usuario extraído del token
    const { id } = req.params; // ID del turno a eliminar

    const turno = await Turno.findOneAndDelete({ _id: id, usuario: usuarioId });

    if (!turno) {
      return res
        .status(404)
        .json({ mensaje: "Turno no encontrado o no pertenece al usuario" });
    }

    res.status(200).json({ mensaje: "Turno eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar el turno", error: error.message });
  }
};

module.exports = {
  crearTurno,
  obtenerTurnos,
  obtenerTurnoPorId,
  actualizarTurno,
  eliminarTurno,
};
