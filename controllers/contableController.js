const Saldos = require("./../utils/saldos")
const Totales = require("./../utils/totales")
const models = require("./../models");
const Op = models.Sequelize.Op
const sequelize = models.sequelize
const Credito = models.Credito
const RetiroSocio = models.RetiroSocio
const Infraestructura = models.Infraestructura
const DeudaComercial = models.DeudaComercial
const DeudaFinanciera = models.DeudaFinanciera
const DeudaFiscal = models.DeudaFiscal
const DeudaSocial = models.DeudaSocial
const DeudaOtra = models.DeudaOtra
const MovimientoCompra = models.MovimientoCompra;
const MovimientoVenta = models.MovimientoVenta;


var contableController = {};

/* API Caja */
contableController.getCaja = async (req, res) => {
    var caja = await Saldos.saldoCaja(req.params.empresaId, req.params.fecha)
    res.send(caja)
}

/* API Banco */
contableController.getBanco = async (req, res) => {
    var banco = await Saldos.saldoBanco(req.params.empresaId, req.params.fecha)
    res.send(banco)
}

/* API Inversiones Transitorias */
contableController.getInversiones = async (req, res) => {
    var inversiones = await Saldos.saldoInversion(req.params.empresaId, req.params.fecha)
    res.send(inversiones)
}

/* API Créditos */
contableController.getCreditos = (req, res) => {
    var fecha = new Date(req.params.fecha)
    var saldos = []

    Credito.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(creditos => {
        if (creditos.length > 0) {
            for (let i = 0; i < creditos.length; i++) {
                const credito = creditos[i];

                credito.dataValues.saldo = parseFloat(credito.monto)
                MovimientoVenta.findAll({
                    where: {
                        concepto: 'Credito',
                        conceptoId: credito.creditoId
                    }
                }).then(movimientos => {
                    movimientos.forEach(mov => {
                        if (new Date(mov.fecha) <= fecha) {
                            credito.dataValues.saldo -= parseFloat(mov.monto)
                        }
                    });
                    saldos.push(credito)
                }).then(() => {
                    if (i == (creditos.length - 1)) {
                        res.send(saldos)
                    }
                })
            }
        } else {
            res.send(saldos)
        }
    })
}

/* API Retiro Socios */
contableController.getRetiroSocios = (req, res) => {
    var fecha = new Date(req.params.fecha)
    var saldos = []

    RetiroSocio.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(retiros => {
        if (retiros.length > 0) {
            for (let i = 0; i < retiros.length; i++) {
                const retiro = retiros[i];

                retiro.dataValues.saldo = parseFloat(retiro.monto)
                MovimientoCompra.findAll({
                    where: {
                        concepto: 'RetiroSocio',
                        conceptoId: retiro.retiroSocioId
                    }
                }).then(movimientos => {
                    movimientos.forEach(mov => {
                        if (new Date(mov.fecha) <= fecha) {
                            retiro.dataValues.saldo -= parseFloat(mov.monto)
                        }
                    });
                    saldos.push(retiro)
                }).then(() => {
                    if (i == (retiros.length - 1)) {
                        res.send(saldos)
                    }
                })
            }
        } else {
            res.send(saldos)
        }
    })
}

/* API Mejoras-Infraestructura */
contableController.getInfraestructuras = (req, res) => {
    var fecha = new Date(req.params.fecha)

    Infraestructura.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(infraestructuras => {
        var valorTotal = 0

        infraestructuras.map(infraestructura => {
            if ((!infraestructura.fechaVenta || new Date(infraestructura.fechaVenta) > fecha) && new Date(infraestructura.fechaCompra) <= fecha) {

                var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(infraestructura.fechaCompra);
                antiguedad = Math.trunc(antiguedad / (1000 * 60 * 60 * 24 * 365))
                var valorMercado = infraestructura.cantidad * infraestructura.valorUnitario;
                var valorResidualMonto = infraestructura.cantidad * infraestructura.valorUnitario * infraestructura.valorResidual / 100;
                var amortizacion = (valorMercado - valorResidualMonto) / infraestructura.vidaUtil
                var amortizacionAcumulada;
                var valorANuevo;

                if (amortizacion * antiguedad >= valorMercado) {
                    amortizacionAcumulada = valorMercado
                } else {
                    amortizacionAcumulada = amortizacion * antiguedad
                }

                if (valorMercado - amortizacionAcumulada <= 0) {
                    valorANuevo = valorMercado
                } else {
                    valorANuevo = valorMercado - amortizacionAcumulada
                }

                valorTotal += parseFloat(valorANuevo)
            }
        });

        res.send({valorTotal});
    });
}

/* API Deudas Comerciales */
contableController.getDeudasComerciales = (req, res) => {
    var fecha = new Date(req.params.fecha)
    var saldos = []

    DeudaComercial.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(deudas => {
        if (deudas.length > 0) {
            for (let i = 0; i < deudas.length; i++) {
                const deuda = deudas[i];

                deuda.dataValues.saldo = parseFloat(deuda.monto)
                MovimientoCompra.findAll({
                    where: {
                        concepto: 'DeudaComercial',
                        conceptoId: deuda.deudaComercialId
                    }
                }).then(movimientos => {
                    movimientos.forEach(mov => {
                        if (new Date(mov.fecha) <= fecha) {
                            deuda.dataValues.saldo -= parseFloat(mov.monto)
                        }
                    });
                    saldos.push(deuda)
                }).then(() => {
                    if (i == (deudas.length - 1)) {
                        res.send(saldos)
                    }
                })
            }
        } else {
            res.send(saldos)
        }
    })
}

/* API Deudas Financieras */
contableController.getDeudasFinancieras = (req, res) => {
    var fecha = new Date(req.params.fecha)
    var saldos = []

    DeudaFinanciera.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(deudas => {
        if (deudas.length > 0) {
            for (let i = 0; i < deudas.length; i++) {
                const deuda = deudas[i];

                deuda.dataValues.saldo = parseFloat(deuda.monto)
                MovimientoCompra.findAll({
                    where: {
                        concepto: 'DeudaFinanciera',
                        conceptoId: deuda.deudaFinancieraId
                    }
                }).then(movimientos => {
                    movimientos.forEach(mov => {
                        if (new Date(mov.fecha) <= fecha) {
                            deuda.dataValues.saldo -= parseFloat(mov.monto)
                        }
                    });
                    saldos.push(deuda)
                }).then(() => {
                    if (i == (deudas.length - 1)) {
                        res.send(saldos)
                    }
                })
            }
        } else {
            res.send(saldos)
        }
    })
}

/* API Deudas Fiscales */
contableController.getDeudasFiscales = (req, res) => {
    var fecha = new Date(req.params.fecha)
    var saldos = []

    DeudaFiscal.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(deudas => {
        if (deudas.length > 0) {
            for (let i = 0; i < deudas.length; i++) {
                const deuda = deudas[i];

                deuda.dataValues.saldo = parseFloat(deuda.monto)
                MovimientoCompra.findAll({
                    where: {
                        concepto: 'DeudaFiscal',
                        conceptoId: deuda.deudaFiscalId
                    }
                }).then(movimientos => {
                    movimientos.forEach(mov => {
                        if (new Date(mov.fecha) <= fecha) {
                            deuda.dataValues.saldo -= parseFloat(mov.monto)
                        }
                    });
                    saldos.push(deuda)
                }).then(() => {
                    if (i == (deudas.length - 1)) {
                        res.send(saldos)
                    }
                })
            }
        } else {
            res.send(saldos)
        }
    })
}

/* API Deudas Sociales */
contableController.getDeudasSociales = (req, res) => {
    var fecha = new Date(req.params.fecha)
    var saldos = []

    DeudaSocial.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(deudas => {
        if (deudas.length > 0) {
            for (let i = 0; i < deudas.length; i++) {
                const deuda = deudas[i];

                deuda.dataValues.saldo = parseFloat(deuda.monto)
                MovimientoCompra.findAll({
                    where: {
                        concepto: 'DeudaSocial',
                        conceptoId: deuda.deudaSocialId
                    }
                }).then(movimientos => {
                    movimientos.forEach(mov => {
                        if (new Date(mov.fecha) <= fecha) {
                            deuda.dataValues.saldo -= parseFloat(mov.monto)
                        }
                    });
                    saldos.push(deuda)
                }).then(() => {
                    if (i == (deudas.length - 1)) {
                        res.send(saldos)
                    }
                })
            }
        } else {
            res.send(saldos)
        }
    })
}


/* API Otras Deudas */
contableController.getDeudasOtras = (req, res) => {
    var fecha = new Date(req.params.fecha)
    var saldos = []

    DeudaOtra.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(deudas => {
        if (deudas.length > 0) {
            for (let i = 0; i < deudas.length; i++) {
                const deuda = deudas[i];

                deuda.dataValues.saldo = parseFloat(deuda.monto)
                MovimientoCompra.findAll({
                    where: {
                        concepto: 'DeudaOtra',
                        conceptoId: deuda.deudaOtraId
                    }
                }).then(movimientos => {
                    movimientos.forEach(mov => {
                        if (new Date(mov.fecha) <= fecha) {
                            deuda.dataValues.saldo -= parseFloat(mov.monto)
                        }
                    });
                    saldos.push(deuda)
                }).then(() => {
                    if (i == (deudas.length - 1)) {
                        res.send(saldos)
                    }
                })
            }
        } else {
            res.send(saldos)
        }
    })
}


module.exports = contableController;