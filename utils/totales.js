function superficieLotes(lotes) {
    var supTotal = 0
    lotes.forEach(lote => {
        if (!lote.fechaVenta) {
            supTotal += parseFloat(lote.superficie)
        }
    });
    return supTotal
}


function valorLotes(lotes) {
    var valorTotal = 0
    lotes.forEach(lote => {
        if (!lote.fechaVenta) {
            valorTotal += parseFloat(lote.superficie * lote.valorHectarea)
        }
    });
    return valorTotal
}

function valorInfraestructuras(infraestructuras) {
    var valorTotal = 0
    infraestructuras.forEach(infraestructura => {
        if (!infraestructura.fechaVenta) {
            //valorTotal += infraestructura.cantidad * infraestructura.valorUnitario
            valorTotal += parseFloat(infraestructura.dataValues.valorANuevo)
        }
    });
    return valorTotal
}

function valorRodados(rodados) {
    var valorTotal = 0
    rodados.forEach(rodado => {
        if (!rodado.fechaVenta) {
            valorTotal += parseFloat(rodado.dataValues.valorANuevo)
        }
    });
    return valorTotal
}

function valorTractores(tractores) {
    var valorTotal = 0
    tractores.forEach(tractor => {
        if (!tractor.fechaVenta) {
            valorTotal += parseFloat(tractor.dataValues.valorANuevo)
        }
    });
    return valorTotal
}

module.exports = {
    valorLotes,
    superficieLotes,
    valorInfraestructuras,
    valorRodados,
    valorTractores,
}