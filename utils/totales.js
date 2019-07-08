function superficieLotes(lotes) {
    var supTotal = 0
    lotes.forEach(lote => {
        if (!lote.fechaVenta) {
            supTotal += lote.superficie
        }
    });
    return supTotal
}


function valorLotes(lotes) {
    var valorTotal = 0
    lotes.forEach(lote => {
        if (!lote.fechaVenta) {
            valorTotal += lote.superficie * lote.valorHectarea
        }
    });
    return valorTotal
}

function valorInfraestructuras(infraestructuras) {
    var valorTotal = 0
    infraestructuras.forEach(infraestructura => {
        if (!infraestructura.fechaVenta) {
            //valorTotal += infraestructura.cantidad * infraestructura.valorUnitario
            valorTotal += infraestructura.dataValues.valorANuevo
        }
    });
    return valorTotal
}

function valorRodados(rodados) {
    var valorTotal = 0
    rodados.forEach(rodado => {
        if (!rodado.fechaVenta) {
            valorTotal += rodado.dataValues.valorANuevo
        }
    });
    return valorTotal
}

module.exports = {
    valorLotes,
    superficieLotes,
    valorInfraestructuras,
    valorRodados,
}