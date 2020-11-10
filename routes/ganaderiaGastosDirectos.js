var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var gastoDirecto = require('./../controllers/ganaderiaGastoDirectoController');

/* List */
router.get('/', Logged.isLogged, gastoDirecto.list);

/* List */
router.get('/:actividadesId', Logged.isLogged, gastoDirecto.list);

/* Add GastoDirecto */
router.post('/add', Logged.isLogged, gastoDirecto.add)

/* Edit GastoDirecto*/
router.post('/edit/:id', Logged.isLogged, gastoDirecto.saveEdit)

/* Delete GastoDirecto */
router.post('/delete/:id', Logged.isLogged, gastoDirecto.delete)

/* Programa Físico GastoDirecto */
router.get('/rpt/:id/programa-fisico', Logged.isLogged, gastoDirecto.rptProgramaFisico)


module.exports = router;