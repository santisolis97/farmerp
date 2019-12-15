var express = require("express");
var logged = require("../utils/logged");
var router = express.Router();
var perfil = require("../controllers/perfilController.js");

router.post("/changePassword", logged.isLogged, perfil.changePassword)

router.post("/setImage", logged.isLogged, perfil.setImage)

router.get("/deleteImage", logged.isLogged, perfil.deleteImage)

module.exports = router;
