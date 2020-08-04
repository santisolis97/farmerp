var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var cultivo = require('./../controllers/cultivoController');

/* List */
router.get('/', Logged.isLogged, cultivo.list);

/* Add Cultivo */
router.post('/cultivo/add', Logged.isLogged, cultivo.add)

/* Edit Cultivo*/
router.post('/cultivo/edit/:id', Logged.isLogged, cultivo.saveEdit)

/* Delete Cultivo */
router.post('/cultivo/delete/:id', Logged.isLogged, cultivo.delete)

/* Add Rubro */
router.post('/rubro/add', Logged.isLogged, cultivo.addRubro)

/* Edit Rubro*/
router.post('/rubro/edit/:id', Logged.isLogged, cultivo.saveEditRubro)

/* Delete Rubro */
router.post('/rubro/delete/:id', Logged.isLogged, cultivo.deleteRubro)


module.exports = router;