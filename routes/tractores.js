var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var tractor = require('../controllers/tractorController');

/* List */
router.get('/', Logged.isLogged, tractor.list);

/* Add */
router.post('/add', Logged.isLogged, tractor.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, tractor.saveEdit)

/* Liquidar */
router.post('/liquidar/:id', Logged.isLogged, tractor.liquidar)

/* Deshacer Liquidar */
router.post('/deshacerLiquidar/:id', Logged.isLogged, tractor.deshacerLiquidar)

/* Delete */
router.post('/delete/:id', Logged.isLogged, tractor.delete)


module.exports = router;