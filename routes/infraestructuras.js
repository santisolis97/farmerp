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

/* Delete */
router.post('/delete/:id', Logged.isLogged, infraestructura.delete)


module.exports = router;