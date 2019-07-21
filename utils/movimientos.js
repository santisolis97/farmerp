const models = require("./../models");
const MovimientoCompra = models.MovimientoCompra;
const MovimientoVenta = models.MovimientoVenta;

function compra(fecha, monto, concepto, conceptoId, cuenta, cuentaId, empresaId) {
    MovimientoCompra.create({
            fecha,
            monto,
            concepto,
            conceptoId,
            cuenta,
            cuentaId,
            empresaId
        }).then(movimiento => {
            return movimiento
        })
        .catch(error => {
            console.log(error)
        });
}

function venta(fecha, monto, concepto, conceptoId, cuenta, cuentaId, empresaId) {
    MovimientoVenta.create({
            fecha,
            monto,
            concepto,
            conceptoId,
            cuenta,
            cuentaId,
            empresaId
        }).then(movimiento => {
            return movimiento
        })
        .catch(error => {
            console.log(error)
        });
}


function deshacerCompra(concepto, conceptoId) {
    MovimientoCompra.destroy({
            where: {
                concepto,
                conceptoId
            }
        }).then(movimiento => {
            return movimiento
        })
        .catch(error => {
            console.log(error)
        });
}

function deshacerVenta(concepto, conceptoId) {
    MovimientoVenta.destroy({
            where: {
                concepto,
                conceptoId
            }
        }).then(movimiento => {
            return movimiento
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