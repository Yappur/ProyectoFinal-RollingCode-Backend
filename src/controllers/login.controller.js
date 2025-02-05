const login = async (req, res) => {
  const { emailUsuario, contrasenia } = req.body; // Cambiado de email a emailUsuario

  try {
    // Buscar por emailUsuario en lugar de email
    const usuario = await Usuario.findOne({ emailUsuario });

    if (!usuario) {
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }

    const esValida = await usuario.compararContrasenia(contrasenia);

    if (!esValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = generarToken(usuario._id);

    res.json({
      mensaje: "Autenticación exitosa",
      token,
      role: usuario.role, // Agregado para enviar el rol al frontend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al autenticar usuario" });
  }
};
