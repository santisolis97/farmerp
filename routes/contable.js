var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');
const contable = require('../controllers/contableController');

/* Situación Patrimonial */
router.get('/situacionPatrimonial', Logged.isLogged, function (req, res) {
    res.render('./../views/contable/situacionPatrimonial/situacionPatrimonial')
});

router.get('/indicesFinancieros', Logged.isLogged, function (req, res) {
    res.render('./../views/contable/indices/indicesFinancieros')
});

router.get('/indicesEconomicos', Logged.isLogged, function (req, res) {
    res.render('./../views/contable/indices/indicesEconomicos')
});

router.get('/estadoResultados', Logged.isLogged, function (req, res) {
    res.render('./../views/contable/estadoResultado/estadoResultado')
});

/* ACTIVO */
/* Caja */
router.get('/apiCaja/:fecha/:empresaId', Logged.isLogged, contable.getCaja)

/* Banco */
router.get('/apiBanco/:fecha/:empresaId', Logged.isLogged, contable.getBanco)

/* Inversiones Transitorias */
router.get('/apiInversiones/:fecha/:empresaId', Logged.isLogged, contable.getInversiones)

/* Disponibilidades */
router.get('/apiDisponibilidades/:fecha/:empresaId', Logged.isLogged, contable.getDisponibilidades)

/* Api Creditos */
router.get('/apiCreditos/:fecha/:empresaId', Logged.isLogged, contable.getCreditos)

/* Api Retiro Socios */
router.get('/apiRetiroSocios/:fecha/:empresaId', Logged.isLogged, contable.getRetiroSocios)

/* Api Insumos */
router.get('/apiInsumos/:fecha/:empresaId', Logged.isLogged, contable.getInsumos)

/* Api Praderas */
router.get('/apiPraderas/:fecha/:empresaId', Logged.isLogged, contable.getPraderas)

/* Api Hacienda - Bienes de Cambio */
router.get('/apiHaciendaCambio/:fecha/:empresaId', Logged.isLogged, contable.getHaciendaCambio)

/* Api Hacienda - Bienes de Uso */
router.get('/apiHaciendaUso/:fecha/:empresaId', Logged.isLogged, contable.getHaciendaUso)

/* Api Stocks */
router.get('/apiStocks/:fecha/:empresaId', Logged.isLogged, contable.getStocks)

/* Api Infraestructuras */
router.get('/apiInfraestructuras/:fecha/:empresaId', Logged.isLogged, contable.getInfraestructuras)

/* Api Administracion */
router.get('/apiAdministracions/:fecha/:empresaId', Logged.isLogged, contable.getAdministracions)

/* Api Equipos */
router.get('/apiEquipos/:fecha/:empresaId', Logged.isLogged, contable.getEquipos)

/* Api Rodados */
router.get('/apiRodados/:fecha/:empresaId', Logged.isLogged, contable.getRodados)

/* Api Tractores */
router.get('/apiTractores/:fecha/:empresaId', Logged.isLogged, contable.getTractores)

/* Api Implementos */
router.get('/apiImplementos/:fecha/:empresaId', Logged.isLogged, contable.getImplementos)

/* Api Autopropulsados */
router.get('/apiAutopropulsados/:fecha/:empresaId', Logged.isLogged, contable.getAutopropulsados)

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