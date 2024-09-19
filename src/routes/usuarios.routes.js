const { Router } = require("express");
const router = Router();

router.get("/");
router.get("/:idUsuario");

router.post("/");
router.put("/:idUsuario");

router.delete("/:idUsuario");

module.exports = router;
