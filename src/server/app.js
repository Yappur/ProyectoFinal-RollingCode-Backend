require("dotenv").config();
require("../DB/config");
const express = require("express");
const path = require("path");
const cors = require("cors");
const verificarToken = require("../middlewares/auth");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.middlewares();
    this.rutas();
  }

  middlewares() {
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
      })
    );
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, "public")));
  }

  rutas() {
    this.app.use("/clases", require("../routes/productos.routes"));
    this.app.use("/usuarios", require("../routes/usuarios.routes"));
    this.app.use("/turnos", verificarToken, require("../routes/turnosRoutes"));
  }

  // listen() {
  //   return this.app;
  // }
  listen() {
    this.app.listen(this.port, () => {
      console.log("servidor levantado", this.port);
    });
  }
}

module.exports = Server;
