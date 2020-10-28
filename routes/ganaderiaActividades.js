var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var ganaderiaActividades = require('./../controllers/ganaderiaActividadesController');

/* List */
router.get('/', Logged.isLogged, ganaderiaActividades.list);

/* Add Actividad Ganadera */
router.post('/add', Logged.isLogged, ganaderiaActividades.add)

/* Edit Actividad Ganadera*/
router.post('/edit/:id', Logged.isLogged, ganaderiaActividades.saveEdit)

/* Delete Actividad Ganadera */
router.post('/delete/:id', Logged.isLogged, ganaderiaActividades.delete)

module.exports = router