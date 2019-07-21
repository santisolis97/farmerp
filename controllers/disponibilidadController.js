const models = require("./../models");
const Caja = models.Caja;
const Banco = models.Banco;
const Inversion = models.Inversion;
const MovimientoCompra = models.MovimientoCompra;
const MovimientoVenta = models.MovimientoVenta;

var disponibilidadController = {};

disponibilidadController.show = function (req, res) {
    var cajaMontoFinal;
    var bancoMontoFinal;

    Caja.findOne({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(caja => {
        cajaMontoFinal = caja.montoInicial

        Banco.findOne({
            where: {
                empresaId: res.locals.empresa.empresaId
            }
        }).then(banco => {
            bancoMontoFinal = banco.montoInicial

            Inversion.findOne({
                where: {
                    empresaId: res.locals.empresa.empresaId
                }
            }).then(inversion => {

                MovimientoCompra.findAll({
                    where: {
                        empresaId: res.locals.empresa.empresaId,
                    }
                }).then(movimientosCompra => {

                    movimientosCompra.forEach(movimiento => {
                        if (movimiento.cuenta == 'Caja') {
                            cajaMontoFinal -= movimiento.monto
                        }

                        if (movimiento.cuenta == 'Banco') {
                            bancoMontoFinal -= movimiento.monto
                        }
                    });

                    MovimientoVenta.findAll({
                        where: {
                            empresaId: res.locals.empresa.empresaId,
                        }
                    }).then(movimientosVenta => {

                        movimientosVenta.forEach(movimiento => {
                            if (movimiento.cuenta == 'Caja') {
                                cajaMontoFinal += movimiento.monto
                            }

                            if (movimiento.cuenta == 'Banco') {
                                bancoMontoFinal += movimiento.monto
                            }
                        });

                        caja.montoFinal = cajaMontoFinal
                        banco.montoFinal = bancoMontoFinal
                        res.render("recursos/disponibilidades/disponibilidades", {
                            caja,
                            banco,
                            inversion
                        })
                    })
                })

            })
        })
    })
}

disponibilidadController.updateCaja = function (req, res) {
    var reqCaja = req.body.caja
    Caja.update(
            reqCaja, {
                where: {
                    cajaId: req.params.id
                }
            }).then(() => {
            req.flash("success_msg", "Se actualizó monto inicial de caja correctamente");
            res.redirect("/disponibilidades");
        })
        .catch(err => {
            req.flash("error_msg", "Error al actualizar monto inicial de caja");
            res.redirect("/disponibilidades");
        });
}

disponibilidadController.updateBanco = function (req, res) {
    var reqBanco = req.body.banco
    Banco.update(
            reqBanco, {
                where: {
                    bancoId: req.params.id
                }
            }).then(() => {
            req.flash("success_msg", "Se actualizó monto inicial de caja correctamente");
            res.redirect("/disponibilidades");
        })
        .catch(err => {
            req.flash("error_msg", "Error al actualizar monto inicial de caja");
            res.redirect("/disponibilidades");
        });
}

disponibilidadController.updateInversion = function (req, res) {
    var reqInversion = req.body.inversion
    Inversion.update(
            reqInversion, {
                where: {
                    inversionId: req.params.id
                }
            }).then(() => {
            req.flash("success_msg", "Se actualizó monto inicial de caja correctamente");
            res.redirect("/disponibilidades");
        })
        .catch(err => {
            req.flash("error_msg", "Error al actualizar monto inicial de caja");
            res.redirect("/disponibilidades");
        });
}

module.exports = disponibilidadController