const express = require("express"); /* conmojs */

const path = require("path");

const productos = [
  {
    id: 1,
    nombre: "Funcional",
    precio: 10000,
  },

  {
    id: 2,
    nombre: "Spining",
    precio: 12000,
  },

  {
    id: 3,
    nombre: "Aparatos",
    precio: 15000,
  },

  {
    id: 4,
    nombre: "Allinclusive",
    precio: 30000,
  },
];

class Server {
  constructor() {
    this.app = express();
    this.port = 3001;
    this.middlewares();
    this.rutas();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname + "/public")));
  }

  rutas() {
    this.app.use("/productos", require("../routes/productos.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("servidor levantado", this.port);
    });
  }
}

module.exports = Server;
