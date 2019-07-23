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

function valorAutopropulsados(autopropulsados) {
    var valorTotal = 0
    autopropulsados.forEach(autopropulsado => {
        if (!autopropulsado.fechaVenta) {
            valorTotal += parseFloat(autopropulsado.dataValues.valorANuevo)
        }
    });
    return valorTotal
}

function valorImplementos(implementos) {
    var valorTotal = 0
    implementos.forEach(implemento => {
        if (!implemento.fechaVenta) {
            valorTotal += parseFloat(implemento.dataValues.valorANuevo)
        }
    });
    return valorTotal
}

function valorEquipos(equipos) {
    var valorTotal = 0
    equipos.forEach(equipo => {
        if (!equipo.fechaVenta) {
            valorTotal += parseFloat(equipo.dataValues.valorANuevo)
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
    valorAutopropulsados,
    valorImplementos,
    valorEquipos,
}