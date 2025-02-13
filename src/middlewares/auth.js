const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

  if (!token) {
    return res
      .status(401)
      .json({ mensaje: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = verificado; // Añadir los datos del usuario al request
    next(); // Continuar al siguiente middleware o ruta
  } catch (error) {
    console.error("Error al verificar token:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ mensaje: "Token expirado." });
    }
    res.status(400).json({ mensaje: "Token inválido." });
  }
};

module.exports = verificarToken;
