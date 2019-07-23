var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var administracion = require('../controllers/administracionController');

/* List */
router.get('/', Logged.isLogged, administracion.list);

/* Add */
router.post('/add', Logged.isLogged, administracion.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, administracion.saveEdit)

/* Liquidar */
router.post('/liquidar/:id', Logged.isLogged, administracion.liquidar)

/* Deshacer Liquidar */
router.post('/deshacerLiquidar/:id', Logged.isLogged, administracion.deshacerLiquidar)

/* Delete */
router.post('/delete/:id', Logged.isLogged, administracion.delete)


module.exports = router;