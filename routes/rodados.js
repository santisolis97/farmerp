var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var rodado = require('../controllers/rodadoController');

/* List */
router.get('/', Logged.isLogged, rodado.list);

/* Add */
router.post('/add', Logged.isLogged, rodado.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, rodado.saveEdit)

/* Liquidar */
router.post('/liquidar/:id', Logged.isLogged, rodado.liquidar)

/* Deshacer Liquidar */
router.post('/deshacerLiquidar/:id', Logged.isLogged, rodado.deshacerLiquidar)

/* Delete */
router.post('/delete/:id', Logged.isLogged, rodado.delete)


module.exports = router;