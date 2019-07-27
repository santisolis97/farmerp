var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var credito = require('./../controllers/creditoController');

/* List */
router.get('/', Logged.isLogged, credito.list);

/* Add */
router.post('/add', Logged.isLogged, credito.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, credito.saveEdit)

/* Delete */
router.post('/delete/:id', Logged.isLogged, credito.delete)


module.exports = router;