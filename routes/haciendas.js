var express = require('express');
var router = express.Router();
const Logged = require('../utils/logged');

var hacienda = require('../controllers/haciendaController');

/* List */
router.get('/', Logged.isLogged, hacienda.list);

/* Add */
router.post('/add', Logged.isLogged, hacienda.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, hacienda.saveEdit)

/* Liquidar */
router.post('/liquidar/:id', Logged.isLogged, hacienda.liquidar)

/* Deshacer Liquidar */
router.post('/deshacerLiquidar/:id', Logged.isLogged, hacienda.deshacerLiquidar)

/* Delete */
router.post('/delete/:id', Logged.isLogged, hacienda.delete)


module.exports = router;
