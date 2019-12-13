var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var administrador = require('../controllers/administradorController');

/* List */
router.get('/', Logged.isLogged, administrador.list);

/* Add */
router.post('/add', Logged.isLogged, administrador.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, administrador.saveEdit)

/* Delete */
router.post('/delete/:id', Logged.isLogged, administrador.delete)


module.exports = router;