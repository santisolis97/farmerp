var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var equipo = require('../controllers/equipoController');

/* List */
router.get('/', Logged.isLogged, equipo.list);

/* Add */
router.post('/add', Logged.isLogged, equipo.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, equipo.saveEdit)

/* Liquidar */
router.post('/liquidar/:id', Logged.isLogged, equipo.liquidar)

/* Deshacer Liquidar */
router.post('/deshacerLiquidar/:id', Logged.isLogged, equipo.deshacerLiquidar)

/* Delete */
router.post('/delete/:id', Logged.isLogged, equipo.delete)


module.exports = router;