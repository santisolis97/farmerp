var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var categoriaHacienda = require('../controllers/categoriaHaciendaController');

/* List */
router.get('/', Logged.isLogged, categoriaHacienda.list);

/* Add */
router.post('/add', Logged.isLogged, categoriaHacienda.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, categoriaHacienda.saveEdit)

/* Delete */
router.post('/delete/:id', Logged.isLogged, categoriaHacienda.delete)

/* API - Get by tipoHaciendaId */
router.get('/api/tipo/:tipoHaciendaId', Logged.isLogged, categoriaHacienda.getByTipo)

module.exports = router;