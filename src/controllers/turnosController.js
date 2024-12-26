const Turno = require("../models/turnos.schema");
const Clase = require("../models/producto.schema");
const crearTurno = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Verifica los datos enviados
    const usuarioId = req.usuario.id;
    console.log("Usuario ID:", usuarioId); // Verifica que el ID del usuario esté presente
    const { fecha, hora, clase } = req.body;

    if (!fecha || !hora || !clase) {
      return res
        .status(400)
        .json({ mensaje: "Todos los campos son requeridos" });
    }

    const claseExistente = await Clase.findById(clase);
    if (!claseExistente) {
      return res.status(404).json({ mensaje: "La clase no existe" });
    }

    const nuevoTurno = new Turno({
      usuario: usuarioId,
      fecha,
      hora,
      clase,
    });

    await nuevoTurno.save();

    res
      .status(201)
      .json({ mensaje: "Turno creado exitosamente", turno: nuevoTurno });
  } catch (error) {
    console.error("Error al crear el turno:", error.message); // Registra errores
    res
      .status(500)
      .json({ mensaje: "Error al crear el turno", error: error.message });
  }
};

const obtenerTurnos = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const turnos = await Turno.find({ usuario: usuarioId })
      .populate("clase", "nombre descripcion") // Clase en lugar de Producto
      .sort({ fecha: 1, hora: 1 });

    res.status(200).json(turnos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener los turnos", error: error.message });
  }
};

const obtenerTurnoPorId = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { id } = req.params;

    const turno = await Turno.findOne({ _id: id, usuario: usuarioId })
      .populate("clase", "nombre descripcion") // Clase en lugar de Producto
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
    const usuarioId = req.usuario.id;
    const { id } = req.params;
    const { fecha, hora, clase } = req.body;

    if (clase) {
      const claseExistente = await Clase.findById(clase); // Clase en lugar de Producto
      if (!claseExistente) {
        return res
          .status(404)
          .json({ mensaje: "La clase especificada no existe" });
      }
    }

    const turnoActualizado = await Turno.findOneAndUpdate(
      { _id: id, usuario: usuarioId },
      { fecha, hora, clase },
      { new: true, runValidators: true }
    );

    if (!turnoActualizado) {
      return res
        .status(404)
        .json({ mensaje: "Turno no encontrado o no pertenece al usuario" });
    }

    res.status(200).json({
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
