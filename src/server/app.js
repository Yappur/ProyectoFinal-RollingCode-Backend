require("dotenv").config();
require("../DB/config");
const express = require("express"); /* conmojs */
const path = require("path");
const cors = require("cors");
const verificarToken = require("../middlewares/auth"); // Importar el middleware de verificación de token

class Server {
  constructor() {
    this.app = express();
    this.port = 3001;
    this.middlewares();
    this.rutas();
  }

  middlewares() {
    this.app.use(cors());
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
