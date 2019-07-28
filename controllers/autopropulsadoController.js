const Totales = require("./../utils/totales")
const Movimientos = require("./../utils/movimientos")
const models = require("../models");
const Autopropulsado = models.Autopropulsado;
const Caja = models.Caja;
const Banco = models.Banco;

var autopropulsadoController = {};

autopropulsadoController.list = function (req, res) {
    Autopropulsado.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(autopropulsados => {
        autopropulsados.map(autopropulsado => {
            var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(autopropulsado.fechaCompra);
            antiguedad = Math.trunc(antiguedad / (1000 * 60 * 60 * 24 * 365))
            var valorResidualMonto = autopropulsado.valorUnitario * autopropulsado.valorResidual / 100;
            var amortizacion = (autopropulsado.valorUnitario - valorResidualMonto) / autopropulsado.vidaUtil
            var amortizacionAcumulada;
            var valorANuevo;

            if (amortizacion * antiguedad >= autopropulsado.valorUnitario) {
                amortizacionAcumulada = autopropulsado.valorUnitario
            } else {
                amortizacionAcumulada = amortizacion * antiguedad
            }

            if (autopropulsado.valorUnitario - amortizacionAcumulada <= 0) {
                valorANuevo = autopropulsado.valorUnitario
            } else {
                valorANuevo = autopropulsado.valorUnitario - amortizacionAcumulada
            }

            autopropulsado.dataValues.antiguedad = antiguedad;
            autopropulsado.dataValues.amortizacion = amortizacion.toFixed(2);
            autopropulsado.dataValues.amortizacionAcumulada = amortizacionAcumulada.toFixed(2);
            autopropulsado.dataValues.valorResidualMonto = valorResidualMonto.toFixed(2);
            autopropulsado.dataValues.valorANuevo = valorANuevo.toFixed(2);
        });
        res.render("capital/autopropulsado/autopropulsado-list", {
            autopropulsados: autopropulsados,
            valorTotal: Totales.valorAutopropulsados(autopropulsados)
        });
    });
};

autopropulsadoController.add = function (req, res) {
    reqMC = req.body.movimientoCompra
    Autopropulsado.create(req.body.autopropulsado).then(autopropulsado => {
            if (req.body.tipoAlta == 'compra') {
                reqMC.forEach(async mc => {
                    await Movimientos.compra(autopropulsado.fechaCompra, mc.monto, 'Autopropulsado', autopropulsado.autopropulsadoId, mc.cuenta, mc.cuentaId, autopropulsado.empresaId)
                });
            }
            req.flash("success_msg", "Se dio de alta un autopropulsado correctamente");
            res.redirect("/autopropulsados");
        })
        .catch(error => {
            console.log(error)
            req.flash("error_msg", "Error al dar de alta un autopropulsado");
            res.redirect("/autopropulsados");
        });
};

autopropulsadoController.saveEdit = function (req, res) {
    reqMC = req.body.movimientoCompra
    Autopropulsado.findByPk(req.params.id).then(autopropulsado => {
        autopropulsado
            .update(req.body.autopropulsado)
            .then(async () => {
                if (req.body.tipoAlta == 'compra') {
                    await Movimientos.deshacerCompra('Autopropulsado', req.params.id)
                    reqMC.forEach(mc => {
                        Movimientos.compra(autopropulsado.fechaCompra, mc.monto, 'Autopropulsado', autopropulsado.autopropulsadoId, mc.cuenta, mc.cuentaId, autopropulsado.empresaId)
                    });
                }
                req.flash("success_msg", "Se actualizó un autopropulsado correctamente");
                res.redirect("/autopropulsados");
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar un autopropulsado");
                res.redirect("/autopropulsados");
            });
    });
};

autopropulsadoController.delete = function (req, res) {
    Autopropulsado.destroy({
            where: {
                autopropulsadoId: req.params.id
            }
        }).then(async () => {
            await Movimientos.deshacerCompra('Autopropulsado', req.params.id)
            req.flash("success_msg", "Se dio de baja un autopropulsado correctamente");
            res.redirect("/autopropulsados");
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al dar de baja un autopropulsado");
            res.redirect("/autopropulsados");
        });
};

autopropulsadoController.liquidar = function (req, res) {
    var reqTractor = req.body.autopropulsado
    var reqMovimiento = req.body.movimiento

    if (reqMovimiento.cuenta == 'Caja') {
        Caja.findOne({
            where: {
                empresaId: res.locals.empresa.empresaId
            }
        }).then(async caja => {

            await Movimientos.venta(reqTractor.fechaVenta, reqMovimiento.monto, 'Autopropulsado', req.params.id, reqMovimiento.cuenta, caja.cajaId, res.locals.empresa.empresaId)

            Autopropulsado.update(reqTractor, {
                    where: {
                        autopropulsadoId: req.params.id
                    }
                }).then(() => {
                    req.flash("success_msg", "Se liquidó autopropulsado correctamente");
                    res.redirect("/autopropulsados");
                })
                .catch(err => {
                    console.log(err)
                    req.flash("error_msg", "Error al liquidar autopropulsado");
                    res.redirect("/autopropulsados");
                });

        })
    }

    if (reqMovimiento.cuenta == 'Banco') {
        Banco.findOne({
            where: {
                empresaId: res.locals.empresa.empresaId
            }
        }).then(async banco => {

            await Movimientos.venta(reqTractor.fechaVenta, reqMovimiento.monto, 'Autopropulsado', req.params.id, reqMovimiento.cuenta, banco.bancoId, res.locals.empresa.empresaId)

            Autopropulsado.update(reqTractor, {
                    where: {
                        autopropulsadoId: req.params.id
                    }
                }).then(() => {
                    req.flash("success_msg", "Se liquidó autopropulsado correctamente");
                    res.redirect("/autopropulsados");
                })
                .catch(err => {
                    console.log(err)
                    req.flash("error_msg", "Error al liquidar autopropulsados");
                    res.redirect("/autopropulsados");
                });
        })
    }

};


autopropulsadoController.deshacerLiquidar = function (req, res) {
    Autopropulsado.update({
            fechaVenta: null
        }, {
            where: {
                autopropulsadoId: req.params.id
            }
        }).then(async () => {
            await Movimientos.deshacerVenta('Autopropulsado', req.params.id)
            req.flash("success_msg", "Se deshizo la liquidación de autopropulsado correctamente");
            res.redirect("/autopropulsados");
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al deshacer liquidación de autopropulsado");
            res.redirect("/autopropulsados");
        });
};


module.exports = autopropulsadoController;