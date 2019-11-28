var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');
const Saldos = require('./../utils/saldos');
const contable = require('../controllers/contableController');

/* Situación Patrimonial */
router.get('/situacionPatrimonial', Logged.isLogged, async function (req, res) {
    res.render('./../views/contable/situacionPatrimonial/situacionPatrimonial')
});

/* ACTIVO */
/* Caja */
router.get('/apiCaja/:fecha/:empresaId', Logged.isLogged, contable.getCaja)

/* Banco */
router.get('/apiBanco/:fecha/:empresaId', Logged.isLogged, contable.getBanco)

/* Inversiones Transitorias */
router.get('/apiInversiones/:fecha/:empresaId', Logged.isLogged, contable.getInversiones)

/* Api Creditos */
router.get('/apiCreditos/:fecha/:empresaId', Logged.isLogged, contable.getCreditos)

/* Api Retiro Socios */
router.get('/apiRetiroSocios/:fecha/:empresaId', Logged.isLogged, contable.getRetiroSocios)

/* Api Insumos */
router.get('/apiInsumos/:fecha/:empresaId', Logged.isLogged, contable.getInsumos)



/* Api Infraestructuras */
router.get('/apiInfraestructuras/:fecha/:empresaId', Logged.isLogged, contable.getInfraestructuras)

/* Api Lotes */
router.get('/apiLotes/:fecha/:empresaId', Logged.isLogged, contable.getLotes)





/* PASIVO */
/* Api Deudas Comerciales */
router.get('/apiDeudasComerciales/:fecha/:empresaId', Logged.isLogged, contable.getDeudasComerciales)

/* Api Deudas Financieras */
router.get('/apiDeudasFinancieras/:fecha/:empresaId', Logged.isLogged, contable.getDeudasFinancieras)

/* Api Deudas Fiscales */
router.get('/apiDeudasFiscales/:fecha/:empresaId', Logged.isLogged, contable.getDeudasFiscales)

/* Api Deudas Sociales */
router.get('/apiDeudasSociales/:fecha/:empresaId', Logged.isLogged, contable.getDeudasSociales)

/* Api Deudas Otras */
router.get('/apiDeudasOtras/:fecha/:empresaId', Logged.isLogged, contable.getDeudasOtras)

module.exports = router;