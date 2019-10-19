var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');
const Saldos = require('./../utils/saldos');

/* Situación Patrimonial */
router.get('/situacionPatrimonial/:fecha', Logged.isLogged, async function (req, res) {

    var caja = await Saldos.saldoCaja(res.locals.empresa.empresaId, req.params.fecha)
    var banco = await Saldos.saldoBanco(res.locals.empresa.empresaId, req.params.fecha)
    var inversion = await Saldos.saldoInversion(res.locals.empresa.empresaId, req.params.fecha)
    var creditos = await Saldos.saldoCreditos(res.locals.empresa.empresaId, req.params.fecha)

    console.log(creditos)
    res.render('./../views/contable/situacionPatrimonial/situacionPatrimonial', {
        caja,
        banco,
        inversion,
        creditos
    })
});




module.exports = router;