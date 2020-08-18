var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var cultivo = require('./../controllers/cultivoController');

/* List */
router.get('/', Logged.isLogged, cultivo.list);

/* Add Cultivo */
router.post('/add', Logged.isLogged, cultivo.add)

/* Edit Cultivo*/
router.post('/edit/:id', Logged.isLogged, cultivo.saveEdit)

/* Delete Cultivo */
router.post('/delete/:id', Logged.isLogged, cultivo.delete)

module.exports = router