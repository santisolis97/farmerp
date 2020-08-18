var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var datosBase = require('./../controllers/datosBaseController');

/* List */
router.get('/', Logged.isLogged, datosBase.list);

/* Add Rubro */
router.post('/rubro/add', Logged.isLogged, datosBase.addRubro)

/* Edit Rubro*/
router.post('/rubro/edit/:id', Logged.isLogged, datosBase.saveEditRubro)

/* Delete Rubro */
router.post('/rubro/delete/:id', Logged.isLogged, datosBase.deleteRubro)

/* Add Concepto */
router.post('/concepto/add', Logged.isLogged, datosBase.addConcepto)

/* Edit Concepto*/
router.post('/concepto/edit/:id', Logged.isLogged, datosBase.saveEditConcepto)

/* Delete Concepto */
router.post('/concepto/delete/:id', Logged.isLogged, datosBase.deleteConcepto)


module.exports = router;