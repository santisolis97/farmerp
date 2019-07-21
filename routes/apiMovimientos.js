var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');
const models = require("./../models");
const MovimientoCompra = models.MovimientoCompra
const MovimientoVenta = models.MovimientoVenta

/* Get Movimientos Compras por Concepto */
router.get('/getCompras/:empresaId/:concepto/:conceptoId', Logged.isLogged, function (req, res) {
    MovimientoCompra.findAll({
        where: {
            concepto: req.params.concepto,
            conceptoId: req.params.conceptoId,
            empresaId: req.params.empresaId
        }
    }).then(movimientos => {
        res.send({
            movimientos
        }) 
    })
});




module.exports = router;