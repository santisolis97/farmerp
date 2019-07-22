var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var implemento = require('../controllers/implementoController');

/* List */
router.get('/', Logged.isLogged, implemento.list);

/* Add */
router.post('/add', Logged.isLogged, implemento.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, implemento.saveEdit)

/* Liquidar */
router.post('/liquidar/:id', Logged.isLogged, implemento.liquidar)

/* Deshacer Liquidar */
router.post('/deshacerLiquidar/:id', Logged.isLogged, implemento.deshacerLiquidar)

/* Delete */
router.post('/delete/:id', Logged.isLogged, implemento.delete)


module.exports = router;