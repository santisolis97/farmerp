var express = require('express');
var router = express.Router();
const Logged = require('../utils/logged');

var deudaOtra = require('../controllers/deudaOtraController.js');

/* List */
router.get('/', Logged.isLogged, deudaOtra.list);

/* Add */
router.post('/add', Logged.isLogged, deudaOtra.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, deudaOtra.saveEdit)

/* Delete */
router.post('/delete/:id', Logged.isLogged, deudaOtra.delete)


module.exports = router;