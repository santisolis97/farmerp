var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var infraestructura = require('../controllers/infraestructuraController');

/* List */
router.get('/', Logged.isLogged, infraestructura.list);

/* Add */
router.post('/add', Logged.isLogged, infraestructura.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, infraestructura.saveEdit)

/* Liquidar */
router.post('/liquidar/:id', Logged.isLogged, infraestructura.liquidar)

/* Deshacer Liquidar */
router.post('/deshacerLiquidar/:id', Logged.isLogged, infraestructura.deshacerLiquidar)

/* Delete */
router.post('/delete/:id', Logged.isLogged, infraestructura.delete)


module.exports = router;