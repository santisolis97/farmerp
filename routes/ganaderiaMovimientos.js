var express = require('express');
var router = express.Router();
const Logged = require('../utils/logged');

var movimientos = require('../controllers/ganaderiaMovimientoController');

/* List */
router.get('/', Logged.isLogged, movimientos.list);

/* List */
router.get('/:haciendaId', Logged.isLogged, movimientos.list);

/* Edit Movimientos*/
router.post('/edit/:id', Logged.isLogged, movimientos.saveEdit)

/* Delete Movimientos */
router.post('/delete/:id', Logged.isLogged, movimientos.delete)

/* Add Movimientos */
router.post('/add', Logged.isLogged, movimientos.add)


module.exports = router;