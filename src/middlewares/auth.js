const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ mensaje: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET); // Validar el token
    req.usuario = verificado; // Añadir los datos del usuario al request
    next();
  } catch (error) {
    res.status(400).json({ mensaje: "Token inválido." });
  }
};

module.exports = verificarToken;
