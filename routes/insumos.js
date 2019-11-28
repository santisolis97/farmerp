var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var insumo = require('../controllers/insumoController');

/* List */
router.get('/', Logged.isLogged, insumo.list);

/* Add */
router.post('/add', Logged.isLogged, insumo.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, insumo.saveEdit)

/* Delete */
router.post('/delete/:id', Logged.isLogged, insumo.delete)


module.exports = router;