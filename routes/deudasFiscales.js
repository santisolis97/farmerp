var express = require('express');
var router = express.Router();
const Logged = require('../utils/logged');

var deudaFiscal = require('../controllers/deudaFiscalController');

/* List */
router.get('/', Logged.isLogged, deudaFiscal.list);

/* Add */
router.post('/add', Logged.isLogged, deudaFiscal.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, deudaFiscal.saveEdit)

/* Delete */
router.post('/delete/:id', Logged.isLogged, deudaFiscal.delete)


module.exports = router;