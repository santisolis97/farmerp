var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var tipoHacienda = require('../controllers/tipoHaciendaController');

/* List */
router.get('/', Logged.isLogged, tipoHacienda.list);

/* List id */
router.get('/:id', Logged.isLogged, tipoHacienda.getbyId);

/* Add */
router.post('/add', Logged.isLogged, tipoHacienda.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, tipoHacienda.saveEdit)

/* Delete */
router.post('/delete/:id', Logged.isLogged, tipoHacienda.delete)

/* Evolucion Rodeo */
router.get('/rpt/:id/evolucion-rodeo', Logged.isLogged, tipoHacienda.rptEvolucionRodeo)


module.exports = router;