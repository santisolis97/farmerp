const models = require("./../models");
const MovimientoCompra = models.MovimientoCompra;
const MovimientoVenta = models.MovimientoVenta;

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
    await MovimientoCompra.destroy({
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