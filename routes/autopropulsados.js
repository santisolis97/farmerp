var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var autopropulsado = require('../controllers/autopropulsadoController');

/* List */
router.get('/', Logged.isLogged, autopropulsado.list);

/* Add */
router.post('/add', Logged.isLogged, autopropulsado.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, autopropulsado.saveEdit)

/* Liquidar */
router.post('/liquidar/:id', Logged.isLogged, autopropulsado.liquidar)

/* Deshacer Liquidar */
router.post('/deshacerLiquidar/:id', Logged.isLogged, autopropulsado.deshacerLiquidar)

/* Delete */
router.post('/delete/:id', Logged.isLogged, autopropulsado.delete)


module.exports = router;