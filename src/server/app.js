require("dotenv").config();
require("../DB/config");
const express = require("express");
const path = require("path");
const cors = require("cors");
const verificarToken = require("../middlewares/auth");

class Server {
  constructor() {
    this.app = express();
    this.port = 3001;
    this.middlewares();
    this.rutas();
  }

  middlewares() {
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
      })
    );
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname + "/public")));
  }

  rutas() {
    // Rutas públicas (no requieren autenticación)
    this.app.use("/clases", require("../routes/productos.routes"));
    this.app.use("/usuarios", require("../routes/usuarios.routes"));

    // Rutas protegidas (requieren autenticación)
    this.app.use("/turnos", verificarToken, require("../routes/turnosRoutes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("servidor levantado", this.port);
    });
  }
}

module.exports = Server;
