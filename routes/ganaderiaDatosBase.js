var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var ganaderiadatosBase = require('./../controllers/ganaderiaDatosBaseController');

/* List */
router.get('/', Logged.isLogged,ganaderiadatosBase.list);

/* Add Rubro */
router.post('/rubro/add', Logged.isLogged, ganaderiadatosBase.addRubro)

/* Edit Rubro*/
router.post('/rubro/edit/:id', Logged.isLogged, ganaderiadatosBase.saveEditRubro)

/* Delete Rubro */
router.post('/rubro/delete/:id', Logged.isLogged, ganaderiadatosBase.deleteRubro)

/* Add Concepto */
router.post('/concepto/add', Logged.isLogged, ganaderiadatosBase.addConcepto)

/* Edit Concepto*/
router.post('/concepto/edit/:id', Logged.isLogged, ganaderiadatosBase.saveEditConcepto)

/* Delete Concepto */
router.post('/concepto/delete/:id', Logged.isLogged, ganaderiadatosBase.deleteConcepto)


module.exports = router;