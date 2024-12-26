const { response, request } = require("express");
const Clase = require("../models/producto.schema");

const obtenerClases = async (req = request, res = response) => {
  const { _id } = req.query;
  try {
    const [total, clases] = await Promise.all([
      Clase.countDocuments(),
      Clase.find(_id).sort({ nombre: 1 }),
    ]);
    res.json({
      total,
      clases,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al obtener las clases",
    });
  }
};

const obtenerClase = async (req = request, res = response) => {
  const { idClase } = req.params;
  const clase = await Clase.findById(idClase);
  res.json({
    clase,
  });
};

const crearClase = async (req = request, res = response) => {
  const { nombre, precio, categoria, descripcion, img, stock } = req.body;

  const claseDB = await Clase.findOne({ nombre });
  if (claseDB) {
    return res.status(400).json({
      msg: `La clase ${claseDB.nombre} ya existe`,
    });
  }

  const data = {
    nombre,
    categoria,
    descripcion,
    img,
  };
  const clase = new Clase(data);

  await clase.save();
  console.log(clase);
  res.status(201).json({
    msg: "Se agregó la clase",
  });
};

const actualizarClase = async (req = request, res = response) => {
  const { idClase } = req.params;
  const { nombre, categoria, descripcion, disponible } = req.body;

  let data = {
    nombre,
    descripcion,
    categoria,
    disponible,
  };

  if (req.body.nombre) {
    data.nombre = req.body.nombre;
  }

  if (req.body.stock) {
    data.stock = req.body.stock;
  }
  if (req.body.img) {
    data.img = req.body.img;
  }

  const clase = await Clase.findByIdAndUpdate(idClase, data, {
    new: true,
  });
  res.status(200).json(clase);
};

const borradoFisicoDeLaClase = async (req = request, res = response) => {
  const { idClase } = req.params;

  try {
    const claseBorrada = await Clase.findOneAndDelete({
      _id: idClase,
    });

    if (!claseBorrada) {
      return res.status(404).json({
        mensaje: "Clase no encontrada",
      });
    }

    res.json({
      mensaje: "Clase eliminada",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al intentar borrar la clase",
    });
  }
};

module.exports = {
  obtenerClases,
  obtenerClase,
  crearClase,
  actualizarClase,
  borradoFisicoDeLaClase,
};
