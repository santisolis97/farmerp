var express = require('express');
var router = express.Router();
const Logged = require('../utils/logged');

var deudaSocial = require('../controllers/deudaSocialController.js');

/* List */
router.get('/', Logged.isLogged, deudaSocial.list);

/* Add */
router.post('/add', Logged.isLogged, deudaSocial.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, deudaSocial.saveEdit)

/* Delete */
router.post('/delete/:id', Logged.isLogged, deudaSocial.delete)


module.exports = router;