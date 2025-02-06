const Turno = require("../models/turnos.schema");
const Clase = require("../models/producto.schema");
const crearTurno = async (req, res) => {
  try {
    console.log("Creando turno...");
    const usuarioId = req.usuario.id;
    const { fecha, hora, clase } = req.body;

    console.log(req.body);

    console.log("Datos de la solicitud:", { fecha, hora, clase }); // Log de los datos de la solicitud

    if (!fecha || !hora || !clase) {
      return res.status(400).json({ mensaje: "Faltan campos requeridos" });
    }

    const claseExistente = await Clase.findById(clase);
    if (!claseExistente) {
      return res.status(404).json({ mensaje: "Clase no encontrada" });
    }

    const nuevoTurno = new Turno({
      usuario: usuarioId,
      fecha,
      hora,
      clase,
    });

    await nuevoTurno.save();
    console.log("Turno creado:", nuevoTurno); // Log del turno creado
    res.status(201).json({ mensaje: "Turno creado", turno: nuevoTurno });
  } catch (error) {
    console.error("Error al crear turno:", error); // Log del error
    res
      .status(500)
      .json({ mensaje: "Error al crear turno", error: error.message });
  }
};
const obtenerTurnos = async (req, res) => {
  try {
    const turnos = await Turno.find()
      .populate("clase", "nombreClase")
      .populate("usuario", "nombreUsuario") // Opcional: traer info del usuario
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

const getTurnosUsuario = async (req, res) => {
  try {
    if (!req.usuario || !req.usuario.id) {
      return res.status(401).json({
        mensaje: "No hay token válido o el usuario no está autenticado",
      });
    }

    const usuarioId = req.usuario.id;

    // Modificar el populate para incluir nombreClase y descripcion
    const turnos = await Turno.find({ usuario: usuarioId })
      .populate("clase", "nombreClase descripcion") // Cambiado de "nombre" a "nombreClase"
      .sort({ fecha: 1, hora: 1 });

    // Agregar un console.log para debugging
    console.log("Turnos encontrados:", JSON.stringify(turnos[0], null, 2));

    if (!turnos.length) {
      return res.status(200).json({
        mensaje: "No se encontraron turnos para este usuario",
        turnos: [],
      });
    }

    res.json({
      mensaje: "Turnos encontrados exitosamente",
      turnos,
    });
  } catch (error) {
    console.error("Error en getTurnosUsuario:", error);
    res.status(500).json({
      mensaje: "Error al obtener los turnos",
      error: error.message,
    });
  }
};

const actualizarTurno = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const isAdmin = req.usuario.role === "admin";
    const { id } = req.params;
    const { fecha, hora, clase } = req.body;

    // Primero, obtener el turno actual para preservar el usuario original
    const turnoExistente = await Turno.findById(id);

    if (!turnoExistente) {
      return res.status(404).json({ mensaje: "Turno no encontrado" });
    }

    // Validar que la clase existe
    if (clase) {
      const claseExistente = await Clase.findById(clase);
      if (!claseExistente) {
        return res
          .status(404)
          .json({ mensaje: "La clase especificada no existe" });
      }
    }

    let query;
    if (isAdmin) {
      query = { _id: id };
    } else {
      query = { _id: id, usuario: usuarioId };
    }

    // Mantener el usuario original en el turno
    const turnoActualizado = await Turno.findOneAndUpdate(
      query,
      {
        fecha,
        hora,
        clase,
        usuario: turnoExistente.usuario, // Mantener el usuario original
      },
      { new: true, runValidators: true }
    )
      .populate("clase")
      .populate("usuario", "nombreUsuario emailUsuario"); // Poblar información del usuario

    if (!turnoActualizado) {
      return res.status(404).json({
        mensaje: isAdmin
          ? "Turno no encontrado"
          : "Turno no encontrado o no pertenece al usuario",
      });
    }

    res.status(200).json({
      mensaje: "Turno actualizado exitosamente",
      turno: turnoActualizado,
    });
  } catch (error) {
    console.error("Error en actualizarTurno:", error);
    res
      .status(500)
      .json({ mensaje: "Error al actualizar el turno", error: error.message });
  }
};
const eliminarTurno = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const userRole = req.usuario.role; // Asumiendo que tienes roles
    const { id } = req.params;

    const turno = await Turno.findById(id);

    if (!turno) {
      return res.status(404).json({ mensaje: "Turno no encontrado" });
    }

    // Si es admin puede eliminar cualquier turno, si no, solo los suyos
    if (userRole !== "admin" && turno.usuario.toString() !== usuarioId) {
      return res.status(403).json({
        mensaje: "No tienes permiso para eliminar este turno",
      });
    }

    await Turno.findByIdAndDelete(id);

    res.status(200).json({ mensaje: "Turno eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar turno:", error);
    res.status(500).json({
      mensaje: "Error al eliminar el turno",
      error: error.message,
    });
  }
};

const testTurno = (req, res) => {
  res.status(200).json({ mensaje: "El test del turno está funcionando" });
};

module.exports = {
  crearTurno,
  obtenerTurnos,
  obtenerTurnoPorId,
  getTurnosUsuario,
  actualizarTurno,
  eliminarTurno,
  testTurno,
};
