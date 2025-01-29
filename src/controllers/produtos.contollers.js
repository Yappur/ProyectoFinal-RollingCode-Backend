const { response, request } = require("express");
const Clase = require("../models/producto.schema");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const obtenerClases = async (req = request, res = response) => {
  const { _id } = req.query;
  try {
    const filter = _id && mongoose.Types.ObjectId.isValid(_id) ? { _id } : {};
    const [total, clases] = await Promise.all([
      Clase.countDocuments(filter),
      Clase.find(filter).sort({ nombre: 1 }),
    ]);
    res.json({ total, clases });
  } catch (error) {
    console.error("Error al obtener las clases:", error);
    res.status(500).json({ msg: "Error al obtener las clases" });
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
  const { nombreClase, categoria, descripcion, img } = req.body;

  // Verificar si ya existe una clase con el mismo nombre
  const claseDB = await Clase.findOne({ nombreClase });
  if (claseDB) {
    return res.status(400).json({
      msg: `La clase ${claseDB.nombreClase} ya existe`,
    });
  }

  // Preparar los datos para guardar en la base de datos
  const data = {
    nombreClase,
    categoria,
    descripcion,
    img,
  };

  try {
    const clase = new Clase(data);

    // Guardar la nueva clase en la base de datos
    await clase.save();

    res.status(201).json({
      msg: "Se agregó la clase",
      clase,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      msg: "Error al guardar la clase",
      error,
    });
  }
};

const actualizarClase = async (req = request, res = response) => {
  const { idClase } = req.params;
  const { nombreClase, categoria, descripcion, disponible } = req.body;

  let data = {
    nombreClase,
    descripcion,
    categoria,
    disponible,
  };

  if (req.body.nombreClase) {
    data.nombreClase = req.body.nombreClase;
  }

  // if (req.body.stock) {
  //   data.stock = req.body.stock;
  // }
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

const pagarClase = async (body) => {
  try {
    console.log("Iniciando configuración de Mercado Pago...");
    console.log("Access Token:", process.env.MP_ACCESS_TOKEN);

    const cliente = new MercadoPagoConfig({
      access_token: process.env.MP_ACCESS_TOKEN,
      sandbox: true, // Esto habilita el entorno sandbox
    });

    const preference = new Preference(cliente);

    console.log("Creando preferencia...");
    const result = await preference.create({
      items: [
        {
          title: "PASE LIBRE",
          unit_price: 12000,
          quantity: 1,
          currency_id: "ARS",
        },
        {
          title: "TRIMESTRAL",
          unit_price: 33000,
          quantity: 1,
          currency_id: "ARS",
        },
        { title: "ANUAL", unit_price: 50000, quantity: 1, currency_id: "ARS" },
      ],
      back_urls: {
        success: "http://localhost:3000/",
        failure: "http://localhost:3000/",
        pending: "http://localhost:3000/",
      },
      auto_return: "approved",
    });

    console.log("Preferencia creada con éxito:", result);

    return {
      url: result.body.init_point,
      statusCode: 200,
    };
  } catch (error) {
    console.error("Error en pagarClase:", error.message);
    return {
      message: `Error al procesar el pago: ${error.message}`,
      statusCode: 500,
    };
  }
};

module.exports = {
  obtenerClases,
  obtenerClase,
  crearClase,
  actualizarClase,
  borradoFisicoDeLaClase,
  pagarClase,
};
