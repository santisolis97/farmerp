var express = require('express');
var router = express.Router();
const Logged = require('../utils/logged');

var retiroSocio = require('../controllers/retiroSocioController.js');

/* List */
router.get('/', Logged.isLogged, retiroSocio.list);

/* Add */
router.post('/add', Logged.isLogged, retiroSocio.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, retiroSocio.saveEdit)

/* Delete */
router.post('/delete/:id', Logged.isLogged, retiroSocio.delete)


module.exports = router;