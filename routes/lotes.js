var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var lote = require('./../controllers/loteController');

/* List */
router.get('/', Logged.isLogged, lote.list);

/* Add */
router.post('/add', Logged.isLogged, lote.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, lote.saveEdit)

/* Liquidar */
router.post('/liquidar/:id', Logged.isLogged, lote.liquidar)

/* Deshacer Liquidar */
router.post('/deshacerLiquidar/:id', Logged.isLogged, lote.deshacerLiquidar)

/* Delete */
router.post('/delete/:id', Logged.isLogged, lote.delete)


module.exports = router;
