require("dotenv").config();

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Base de datos conectada"))
  .catch((error) => console.log(error));
