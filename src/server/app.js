require("../DB/config");
const express = require("express"); /* conmojs */
const path = require("path");
const cors = require("cors");

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
    this.app.use("/clases", require("../routes/productos.routes"));
    this.app.use("/usuarios", require("../routes/usuarios.routes"));
    this.app.use("/turnos", require("../routes/turnosRoutes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("servidor levantado", this.port);
    });
  }
}

module.exports = Server;
