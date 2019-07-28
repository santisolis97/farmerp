var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var deudaFinanciera = require('./../controllers/deudaFinancieraController');

/* List */
router.get('/', Logged.isLogged, deudaFinanciera.list);

/* Add */
router.post('/add', Logged.isLogged, deudaFinanciera.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, deudaFinanciera.saveEdit)

/* Delete */
router.post('/delete/:id', Logged.isLogged, deudaFinanciera.delete)


module.exports = router;