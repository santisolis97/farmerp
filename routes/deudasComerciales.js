var express = require('express');
var router = express.Router();
const Logged = require('../utils/logged');

var deudaComercial = require('../controllers/deudaComercialController');

/* List */
router.get('/', Logged.isLogged, deudaComercial.list);

/* Add */
router.post('/add', Logged.isLogged, deudaComercial.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, deudaComercial.saveEdit)

/* Delete */
router.post('/delete/:id', Logged.isLogged, deudaComercial.delete)


module.exports = router;