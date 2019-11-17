const models = require("./../models");
const MovimientoCompra = models.MovimientoCompra;
const MovimientoVenta = models.MovimientoVenta;
const DeudaComercial = models.DeudaComercial
const DeudaFinanciera = models.DeudaFinanciera


async function compra(fecha, monto, concepto, conceptoId, cuenta, cuentaId, empresaId) {
    if (monto > 0) {
        await MovimientoCompra.create({
                fecha,
                monto,
                concepto,
                conceptoId,
                cuenta,
                cuentaId,
                empresaId
            }).then(async movimiento => {
                if (movimiento.cuenta == 'DeudaComercial') {
                    DeudaComercial.increment({
                        montoMovimientos: movimiento.monto
                    }, {
                        where: {
                            deudaComercialId: movimiento.cuentaId
                        }
                    })
                    DeudaComercial.increment({
                        monto: movimiento.monto
                    }, {
                        where: {
                            deudaComercialId: movimiento.cuentaId
                        }
                    }).then(() => {
                        DeudaComercial.findByPk(movimiento.cuentaId).then(deuda => {
                            let importeCuota = (deuda.monto / deuda.cantCuotas) * (deuda.porcEjercicio / 100)

                            MovimientoCompra.findAll({
                                where: {
                                    concepto: 'DeudaComercial',
                                    conceptoId: movimiento.cuentaId
                                }
                            }).then(movimientos => {
                                movimientos.forEach(movimiento => {
                                    movimiento.update({
                                        monto: importeCuota
                                    })
                                })
                            })
                        })
                    })
                }

                if (movimiento.cuenta == 'DeudaFinanciera') {
                    DeudaFinanciera.increment({
                        montoMovimientos: movimiento.monto
                    }, {
                        where: {
                            deudaFinancieraId: movimiento.cuentaId
                        }
                    })
                    DeudaFinanciera.increment({
                        monto: movimiento.monto
                    }, {
                        where: {
                            deudaFinancieraId: movimiento.cuentaId
                        }
                    }).then(() => {
                        DeudaFinanciera.findByPk(movimiento.cuentaId).then(deuda => {
                            let importeCuota = (deuda.monto / deuda.cantCuotas) * (deuda.porcEjercicio / 100)

                            MovimientoCompra.findAll({
                                where: {
                                    concepto: 'DeudaFinanciera',
                                    conceptoId: movimiento.cuentaId
                                }
                            }).then(movimientos => {
                                movimientos.forEach(movimiento => {
                                    movimiento.update({
                                        monto: importeCuota
                                    })
                                })
                            })
                        })
                    })

                }

                return await movimiento
            })
            .catch(error => {
                console.log(error)
            });
    }
}

async function venta(fecha, monto, concepto, conceptoId, cuenta, cuentaId, empresaId) {
    if (monto > 0) {
        await MovimientoVenta.create({
                fecha,
                monto,
                concepto,
                conceptoId,
                cuenta,
                cuentaId,
                empresaId
            }).then(async movimiento => {
                return await movimiento
            })
            .catch(error => {
                console.log(error)
            });
    }
}


async function deshacerCompra(concepto, conceptoId) {
    await MovimientoCompra.findAll({
            where: {
                concepto,
                conceptoId
            }
        }).then(async movimientos => {
            movimientos.forEach(async movimiento => {
                if (movimiento.cuenta == 'DeudaComercial') {
                    DeudaComercial.decrement({
                        montoMovimientos: movimiento.monto
                    }, {
                        where: {
                            deudaComercialId: movimiento.cuentaId
                        }
                    })
                    DeudaComercial.decrement({
                        monto: movimiento.monto
                    }, {
                        where: {
                            deudaComercialId: movimiento.cuentaId
                        }
                    }).then(() => {
                        DeudaComercial.findByPk(movimiento.cuentaId).then(deuda => {
                            let importeCuota = (deuda.monto / deuda.cantCuotas) * (deuda.porcEjercicio / 100)

                            MovimientoCompra.findAll({
                                where: {
                                    concepto: 'DeudaComercial',
                                    conceptoId: movimiento.cuentaId
                                }
                            }).then(movimientos => {
                                movimientos.forEach(movimiento => {
                                    movimiento.update({
                                        monto: importeCuota
                                    })
                                })
                            })
                        })
                    })
                }
                if (movimiento.cuenta == 'DeudaFinanciera') {
                    DeudaFinanciera.decrement({
                        montoMovimientos: movimiento.monto
                    }, {
                        where: {
                            deudaFinancieraId: movimiento.cuentaId
                        }
                    })
                    DeudaFinanciera.decrement({
                        monto: movimiento.monto
                    }, {
                        where: {
                            deudaFinancieraId: movimiento.cuentaId
                        }
                    }).then(() => {
                        DeudaFinanciera.findByPk(movimiento.cuentaId).then(deuda => {
                            let importeCuota = (deuda.monto / deuda.cantCuotas) * (deuda.porcEjercicio / 100)

                            MovimientoCompra.findAll({
                                where: {
                                    concepto: 'DeudaFinanciera',
                                    conceptoId: movimiento.cuentaId
                                }
                            }).then(movimientos => {
                                movimientos.forEach(movimiento => {
                                    movimiento.update({
                                        monto: importeCuota
                                    })
                                })
                            })
                        })
                    })
                }
                movimiento.destroy()
                return await movimiento
            });
        })
        .catch(error => {
            console.log(error)
        });
}

async function deshacerVenta(concepto, conceptoId) {
    await MovimientoVenta.destroy({
            where: {
                concepto,
                conceptoId
            }
        }).then(async movimiento => {
            return await movimiento
        })
        .catch(error => {
            console.log(error)
        });
}

module.exports = {
    compra,
    venta,
    deshacerCompra,
    deshacerVenta
}