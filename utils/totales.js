function superficieLotes(lotes) {
    var supTotal = 0
    lotes.forEach(lote => {
        supTotal += lote.superficie
    });
    return supTotal
}


function valorLotes(lotes) {
    var valorTotal = 0
    lotes.forEach(lote => {
        valorTotal += lote.superficie * lote.valorHectarea
    });
    return valorTotal
}

function valorInfraestructuras(infraestructuras) {
    var valorTotal = 0
    infraestructuras.forEach(infraestructura => {
        //valorTotal += infraestructura.cantidad * infraestructura.valorUnitario
        valorTotal += infraestructura.dataValues.valorANuevo
    });
    return valorTotal
}

module.exports = {
    valorLotes,
    superficieLotes,
    valorInfraestructuras
}