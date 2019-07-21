var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var disponibilidades = require('../controllers/disponibilidadController');

/* Disponibilidades */
router.get('/', Logged.isLogged, disponibilidades.show);

/* Actualizar Monto Inicial Caja */
router.post('/updateCaja/:id', Logged.isLogged, disponibilidades.updateCaja)

/* Actualizar Monto Inicial Banco */
router.post('/updateBanco/:id', Logged.isLogged, disponibilidades.updateBanco)

/* Actualizar Monto Inicial InversionesTransitorias */
router.post('/updateInversiones/:id', Logged.isLogged, disponibilidades.updateInversion)


module.exports = router;