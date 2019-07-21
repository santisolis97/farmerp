var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');
const Saldos = require('./../utils/saldos');
const models = require("./../models");
const DeudaComercial = models.DeudaComercial

/* Get disponibilidades para compra */
router.get('/getDisponibilidades/:empresaId/:fecha', Logged.isLogged, async function (req, res) {
    //var caja = await Saldos.saldoCaja(req.params.empresaId, req.params.fecha)
    var caja = await Saldos.saldoCaja(req.params.empresaId, res.locals.empresa.finEjercicio)
    //var banco = await Saldos.saldoBanco(req.params.empresaId, req.params.fecha)
    var banco = await Saldos.saldoBanco(req.params.empresaId, res.locals.empresa.finEjercicio)

    var proveedores = await DeudaComercial.findAll({ where: {
        empresaId: req.params.empresaId
    }}).then(async proveedores => {
        return await proveedores
    })


    res.send({
        caja,
        banco,
        proveedores
    })
});




module.exports = router;