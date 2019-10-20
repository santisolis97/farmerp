const models = require("./../models");
const Caja = models.Caja
const Banco = models.Banco
const Inversion = models.Inversion
const Credito = models.Credito
const MovimientoCompra = models.MovimientoCompra;
const MovimientoVenta = models.MovimientoVenta;

async function saldoCaja(empresaId, fecha) {
    var saldo;
    var cajaId;
    fecha = Date.parse(fecha)

    await Caja.findOne({
        where: {
            empresaId
        }
    }).then(async caja => {
        saldo = caja.montoInicial
        cajaId = caja.cajaId

        await MovimientoCompra.findAll({
            where: {
                cuenta: 'Caja',
                cuentaId: caja.cajaId
            }
        }).then(async movimientos => {
            movimientos.forEach(mov => {
                if (Date.parse(mov.fecha) <= fecha) {
                    saldo -= mov.monto
                }
            });

            await MovimientoVenta.findAll({
                where: {
                    cuenta: 'Caja',
                    cuentaId: caja.cajaId
                }
            }).then(async movimientos => {
                movimientos.forEach(mov => {
                    if (Date.parse(mov.fecha) <= fecha) {
                        saldo += mov.monto
                    }
                });
            })
        })
    })
    return {
        saldo: saldo.toFixed(2),
        cajaId
    }
}


async function saldoBanco(empresaId, fecha) {
    var saldo;
    var bancoId;
    
    fecha = Date.parse(fecha)
    
    await Banco.findOne({
        where: {
            empresaId
        }
    }).then(async banco => {
        saldo = banco.montoInicial
        bancoId = banco.bancoId
        
        await MovimientoCompra.findAll({
            where: {
                cuenta: 'Banco',
                cuentaId: banco.bancoId
            }
        }).then(async movimientos => {
            movimientos.forEach(mov => {
                if (Date.parse(mov.fecha) <= fecha) {
                    saldo -= mov.monto
                }
            });
            
            await MovimientoVenta.findAll({
                where: {
                    cuenta: 'Banco',
                    cuentaId: banco.bancoId
                }
            }).then(async movimientos => {
                movimientos.forEach(mov => {
                    if (Date.parse(mov.fecha) <= fecha) {
                        saldo += mov.monto
                    }
                });
            })
        })
    })
    return {
        saldo: saldo.toFixed(2),
        bancoId
    }
}

async function saldoInversion(empresaId, fecha) {
    var saldo;
    var inversionId;
    fecha = Date.parse(fecha)
    
    await Inversion.findOne({
        where: {
            empresaId
        }
    }).then(async inversion => {
        saldo = inversion.montoInicial
        inversionId = inversion.inversionId
        
        await MovimientoCompra.findAll({
            where: {
                cuenta: 'Inversion',
                cuentaId: inversion.inversionId
            }
        }).then(async movimientos => {
            movimientos.forEach(mov => {
                if (Date.parse(mov.fecha) <= fecha) {
                    saldo -= mov.monto
                }
            });
            
            await MovimientoVenta.findAll({
                where: {
                    cuenta: 'Inversion',
                    cuentaId: inversion.inversionId
                }
            }).then(async movimientos => {
                movimientos.forEach(mov => {
                    if (Date.parse(mov.fecha) <= fecha) {
                        saldo += mov.monto
                    }
                });
            })
        })
    })
    return {
        saldo: saldo.toFixed(2),
        inversionId
    }
}

async function saldoCreditos(empresaId, fecha) {
    var saldos = []
    fecha = Date.parse(fecha)
    
    await Credito.findAll({
        where: {
            empresaId
        }
    }).then(async creditos => {
        await creditos.map(async credito => {
            credito.dataValues.saldo = parseFloat(credito.monto)
            
            await MovimientoVenta.findAll({
                where: {
                    concepto: 'Credito',
                    conceptoId: credito.creditoId
                }
            }).then(async movimientos => {
                await movimientos.forEach(async mov => {
                    if (Date.parse(mov.fecha) <= fecha) {
                        credito.dataValues.saldo -= await parseFloat(mov.monto)
                    }
                    //console.log(mov)
                    //console.log(credito)
                });
                //console.log(credito)
                await saldos.push(await credito)
                //console.log(saldos)

            })

        })
        console.log(creditos)
        Promise.all(saldos).then(() => {
            return {
                creditos
            }
        })
    })
}


module.exports = {
    saldoCaja,
    saldoBanco,
    saldoInversion,
    saldoCreditos
}