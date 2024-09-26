const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://rojasluis18:qm2wRpAwJ2sxrC6u@cluster0.os14o.mongodb.net/DB_ProyectoFinal"
  )
  .then(() => console.log("Base de datos conectada"))
  .catch((error) => console.log(errror));
