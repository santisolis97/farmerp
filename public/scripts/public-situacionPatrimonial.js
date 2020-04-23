updateESP(datosEmpresa.finEjercicio)

function updateESP(fecha) {
    if (new Date(fecha) > new Date(datosEmpresa.finEjercicio)) {
        return
    }
    if (new Date(fecha) < new Date(datosEmpresa.inicioEjercicio)) {
        return
    }
    if (isNaN((new Date(fecha)).getTime())) {
        return
    }

    let importeTotalActivos = document.querySelector("#importeTotalActivos");
    let importeTotalActivosCorrientes = document.querySelector("#importeTotalActivosCorrientes");
    let importeTotalActivosNoCorrientes = document.querySelector("#importeTotalActivosNoCorrientes");
    let importeTotalPasivosCorrientes = document.querySelector("#importeTotalPasivosCorrientes");
    let importeTotalPasivos = document.querySelector("#importeTotalPasivos");
    let importeTotalPatrimonioNeto = document.querySelector("#importeTotalPatrimonioNeto");
    let importeTotalPasivosMasPatrimonioNeto = document.querySelector("#importeTotalPasivosMasPatrimonioNeto");

    importeTotalActivosCorrientes.innerHTML = (0).toFixed(2)
    importeTotalActivosNoCorrientes.innerHTML = (0).toFixed(2)
    importeTotalActivos.innerHTML = (0).toFixed(2)
    importeTotalPasivosCorrientes.innerHTML = (0).toFixed(2)
    importeTotalPasivos.innerHTML = (0).toFixed(2)
    importeTotalPatrimonioNeto.innerHTML = (0).toFixed(2)
    importeTotalPasivosMasPatrimonioNeto.innerHTML = (0).toFixed(2)

    /* ACTIVOS */
    updateCaja(fecha)
    updateBanco(fecha)
    updateInversiones(fecha)
    updateDisponibilidades(fecha)
    updateCreditos(fecha)
    updateRetiroSocios(fecha)
    updateInsumos(fecha)
    updatePraderas(fecha)
    updateHaciendaCambio(fecha)
    updateHaciendaUso(fecha)
    updateStocks(fecha)
    updateInfraestructuras(fecha)
    updateAdministracions(fecha)
    updateEquipos(fecha)
    updateRodados(fecha)
    updateTractores(fecha)
    updateImplementos(fecha)
    updateAutopropulsados(fecha)
    updateLotes(fecha)

    /* PASIVOS */
    updateDeudasComerciales(fecha);
    updateDeudasFinancieras(fecha);
    updateDeudasFiscales(fecha);
    updateDeudasSociales(fecha);
    updateDeudasOtras(fecha);
}


function updateCaja(fecha) {
    axios.get('/contable/apiCaja/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let caja = res.data
        $("#importeCaja").remove()
        $("#divCaja").append(`<p id="importeCaja" class="col-md-4 text-right" style="margin-top: -15px">$ ${caja.saldo}</p>`)
    })
}

function updateBanco(fecha) {
    axios.get('/contable/apiBanco/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let banco = res.data
        $("#importeBanco").remove()
        $("#divBanco").append(`<p id="importeBanco" class="col-md-4 text-right" style="margin-top: -15px">$ ${banco.saldo}</p>`)
    })
}

function updateInversiones(fecha) {
    axios.get('/contable/apiInversiones/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let inversiones = res.data
        $("#importeInversiones").remove()
        $("#divInversiones").append(`<p id="importeInversiones" class="col-md-4 text-right" style="margin-top: -15px">$ ${inversiones.saldo}</p>`)
    })
}

function updateDisponibilidades(fecha) {
    axios.get('/contable/apiDisponibilidades/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let disponibilidades = res.data.disponibilidades

        let importeDisponibilidades = document.querySelector("#importeDisponibilidades");
        importeDisponibilidades.innerHTML = disponibilidades.toFixed(2)

        importeTotalActivosCorrientes.innerHTML = (parseFloat(importeTotalActivosCorrientes.innerHTML) + parseFloat(disponibilidades)).toFixed(2)
        importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + parseFloat(disponibilidades)).toFixed(2)
        importeTotalPasivosMasPatrimonioNeto.innerHTML = (parseFloat(importeTotalPasivosMasPatrimonioNeto.innerHTML) + parseFloat(disponibilidades)).toFixed(2)
        importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + parseFloat(disponibilidades)).toFixed(2)
    })
}

function updateCreditos(fecha) {
    axios.get('/contable/apiCreditos/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let creditos = res.data
        let importeTotalCreditos = document.querySelector("#importeTotalCreditos");

        $("#divCreditos").html('')

        importeTotalCreditos.innerHTML = (0).toFixed(2)

        creditos.forEach(credito => {
            $("#divCreditos").append(`
            <div class="form-row">
            <p class="col-md-7" style="margin-top: -15px">${ credito.nombre}</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ credito.saldo.toFixed(2)}</p>
            </div>
            `)

            importeTotalCreditos.innerHTML = (parseFloat(importeTotalCreditos.innerHTML) + credito.saldo).toFixed(2)
            importeTotalActivosCorrientes.innerHTML = (parseFloat(importeTotalActivosCorrientes.innerHTML) + credito.saldo).toFixed(2)
            importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + credito.saldo).toFixed(2)
            importeTotalPasivosMasPatrimonioNeto.innerHTML = (parseFloat(importeTotalPasivosMasPatrimonioNeto.innerHTML) + credito.saldo).toFixed(2)
            importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + credito.saldo).toFixed(2)
        });
    })
}

function updateRetiroSocios(fecha) {
    axios.get('/contable/apiRetiroSocios/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let retiros = res.data
        let importeTotalRetiroSocios = document.querySelector("#importeTotalRetiroSocios");

        $("#divRetiroSocios").html('')

        importeTotalRetiroSocios.innerHTML = (0).toFixed(2)

        retiros.forEach(retiro => {
            $("#divRetiroSocios").append(`
            <div class="form-row">
            <p class="col-md-7" style="margin-top: -15px">${ retiro.nombre}</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ retiro.saldo.toFixed(2) * -1}</p>
            </div>
            `)

            importeTotalRetiroSocios.innerHTML = (parseFloat(importeTotalRetiroSocios.innerHTML) - retiro.saldo).toFixed(2)
            importeTotalActivosCorrientes.innerHTML = (parseFloat(importeTotalActivosCorrientes.innerHTML) - retiro.saldo).toFixed(2)
            importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) - retiro.saldo).toFixed(2)
            importeTotalPasivosMasPatrimonioNeto.innerHTML = (parseFloat(importeTotalPasivosMasPatrimonioNeto.innerHTML) - retiro.saldo).toFixed(2)
            importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) - retiro.saldo).toFixed(2)
        });
    })
}

function updateInsumos(fecha) {
    axios.get('/contable/apiInsumos/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let insumos = res.data
        let importeTotalInsumos = document.querySelector("#importeTotalInsumos");

        $("#divInsumos").html('')

        importeTotalInsumos.innerHTML = (0).toFixed(2)

        insumos.forEach(insumo => {
            $("#divInsumos").append(`
            <div class="form-row">
            <p class="col-md-7" style="margin-top: -15px">${ insumo.concepto}</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ insumo.valorMercado.toFixed(2)}</p>
            </div>
            `)

            importeTotalInsumos.innerHTML = (parseFloat(importeTotalInsumos.innerHTML) + insumo.valorMercado).toFixed(2)
            importeTotalActivosCorrientes.innerHTML = (parseFloat(importeTotalActivosCorrientes.innerHTML) + insumo.valorMercado).toFixed(2)
            importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + insumo.valorMercado).toFixed(2)
            importeTotalPasivosMasPatrimonioNeto.innerHTML = (parseFloat(importeTotalPasivosMasPatrimonioNeto.innerHTML) + insumo.valorMercado).toFixed(2)
            importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + insumo.valorMercado).toFixed(2)
        });
    })
}

function updatePraderas(fecha) {
    axios.get('/contable/apiPraderas/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let praderas = res.data.praderas
        let valorTotal = res.data.valorTotal
        let valorTotalAmortizacion = res.data.valorTotalAmortizacion
        let importePraderasAmortizacion = document.querySelector("#importePraderasAmortizacion");
        let importePraderas = document.querySelector("#importePraderas");

        importePraderasAmortizacion.innerHTML = valorTotalAmortizacion.toFixed(2)
        importePraderas.innerHTML = valorTotal.toFixed(2)

        $("#divPraderasAmortizacion").html('')


        praderas.forEach(pradera => {
            $("#divPraderasAmortizacion").append(`
            <div class="form-row">
            <p class="col-md-7" style="margin-top: -15px">${ pradera.cultivo}</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ pradera.amortizacionAcumulada.toFixed(2)}</p>
            </div>
            `)

            importeTotalActivosCorrientes.innerHTML = (parseFloat(importeTotalActivosCorrientes.innerHTML) + pradera.amortizacionAcumulada).toFixed(2)
            importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + pradera.amortizacionAcumulada).toFixed(2)
            importeTotalPasivosMasPatrimonioNeto.innerHTML = (parseFloat(importeTotalPasivosMasPatrimonioNeto.innerHTML) + pradera.amortizacionAcumulada).toFixed(2)
            importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + pradera.amortizacionAcumulada).toFixed(2)
        });

        $("#divPraderas").html('')


        praderas.forEach(pradera => {
            $("#divPraderas").append(`
            <div class="form-row">
            <p class="col-md-7" style="margin-top: -15px">${ pradera.cultivo}</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ pradera.valorANuevo.toFixed(2)}</p>
            </div>
            `)

            importeTotalActivosNoCorrientes.innerHTML = (parseFloat(importeTotalActivosNoCorrientes.innerHTML) + pradera.valorANuevo).toFixed(2)
            importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + pradera.valorANuevo).toFixed(2)
            importeTotalPasivosMasPatrimonioNeto.innerHTML = (parseFloat(importeTotalPasivosMasPatrimonioNeto.innerHTML) + pradera.valorANuevo).toFixed(2)
            importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + pradera.valorANuevo).toFixed(2)
        });
    })
}

function updateHaciendaCambio(fecha) {
    axios.get('/contable/apiHaciendaCambio/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let haciendas = res.data.haciendaCambio
        let valorTotalHaciendaCambio = res.data.totalHaciendaCambio

        let importeHaciendaCambio = document.querySelector("#importeHaciendaCambio");

        importeHaciendaCambio.innerHTML = valorTotalHaciendaCambio.toFixed(2)

        $("#divHaciendaCambio").html('')


        haciendas.forEach(hacienda => {
            $("#divHaciendaCambio").append(`
            <div class="form-row">
            <p class="col-md-7" style="margin-top: -15px">${ hacienda.tipoHacienda}</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ hacienda.valorTotal.toFixed(2)}</p>
            </div>
            `)

            importeTotalActivosCorrientes.innerHTML = (parseFloat(importeTotalActivosCorrientes.innerHTML) + hacienda.valorTotal).toFixed(2)
            importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + hacienda.valorTotal).toFixed(2)
            importeTotalPasivosMasPatrimonioNeto.innerHTML = (parseFloat(importeTotalPasivosMasPatrimonioNeto.innerHTML) + hacienda.valorTotal).toFixed(2)
            importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + hacienda.valorTotal).toFixed(2)
        });
    })
}

function updateHaciendaUso(fecha) {
    axios.get('/contable/apiHaciendaUso/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let haciendas = res.data.haciendaUso
        let valorTotalHaciendaUso = res.data.totalHaciendaUso

        let importeHaciendaUso = document.querySelector("#importeHaciendaUso");

        importeHaciendaUso.innerHTML = valorTotalHaciendaUso.toFixed(2)

        $("#divHaciendaUso").html('')


        haciendas.forEach(hacienda => {
            $("#divHaciendaUso").append(`
            <div class="form-row">
            <p class="col-md-7" style="margin-top: -15px">${ hacienda.tipoHacienda}</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ hacienda.valorTotal.toFixed(2)}</p>
            </div>
            `)

            importeTotalActivosNoCorrientes.innerHTML = (parseFloat(importeTotalActivosNoCorrientes.innerHTML) + hacienda.valorTotal).toFixed(2)
            importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + hacienda.valorTotal).toFixed(2)
            importeTotalPasivosMasPatrimonioNeto.innerHTML = (parseFloat(importeTotalPasivosMasPatrimonioNeto.innerHTML) + hacienda.valorTotal).toFixed(2)
            importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + hacienda.valorTotal).toFixed(2)
        });
    })
}

function updateStocks(fecha) {
    axios.get('/contable/apiStocks/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let insumos = res.data
        let importeStock = document.querySelector("#importeStock");

        $("#divStock").html('')

        importeStock.innerHTML = (0).toFixed(2)

        insumos.forEach(insumo => {
            $("#divStock").append(`
            <div class="form-row">
            <p class="col-md-7" style="margin-top: -15px">${ insumo.concepto}</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ insumo.valorMercado.toFixed(2)}</p>
            </div>
            `)

            importeStock.innerHTML = (parseFloat(importeStock.innerHTML) + insumo.valorMercado).toFixed(2)
            importeTotalActivosCorrientes.innerHTML = (parseFloat(importeTotalActivosCorrientes.innerHTML) + insumo.valorMercado).toFixed(2)
            importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + insumo.valorMercado).toFixed(2)
            importeTotalPasivosMasPatrimonioNeto.innerHTML = (parseFloat(importeTotalPasivosMasPatrimonioNeto.innerHTML) + insumo.valorMercado).toFixed(2)
            importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + insumo.valorMercado).toFixed(2)
        });
    })
}

function updateInfraestructuras(fecha) {
    axios.get('/contable/apiInfraestructuras/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let valorTotal = res.data.valorTotal
        let importeInfraestructura = document.querySelector("#importeInfraestructura")

        importeInfraestructura.innerHTML = parseFloat(valorTotal).toFixed(2)
        importeTotalActivosNoCorrientes.innerHTML = (parseFloat(importeTotalActivosNoCorrientes.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalPasivosMasPatrimonioNeto.innerHTML = (parseFloat(importeTotalPasivosMasPatrimonioNeto.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + parseFloat(valorTotal)).toFixed(2)
    })
}

function updateAdministracions(fecha) {
    axios.get('/contable/apiAdministracions/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let valorTotal = res.data.valorTotal
        let importeAdministracion = document.querySelector("#importeAdministracion")

        importeAdministracion.innerHTML = parseFloat(valorTotal).toFixed(2)
        importeTotalActivosNoCorrientes.innerHTML = (parseFloat(importeTotalActivosNoCorrientes.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalPasivosMasPatrimonioNeto.innerHTML = (parseFloat(importeTotalPasivosMasPatrimonioNeto.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + parseFloat(valorTotal)).toFixed(2)
    })
}

function updateEquipos(fecha) {
    axios.get('/contable/apiEquipos/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let valorTotal = res.data.valorTotal
        let importeEquipos = document.querySelector("#importeEquipos")

        importeEquipos.innerHTML = parseFloat(valorTotal).toFixed(2)
        importeTotalActivosNoCorrientes.innerHTML = (parseFloat(importeTotalActivosNoCorrientes.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalPasivosMasPatrimonioNeto.innerHTML = (parseFloat(importeTotalPasivosMasPatrimonioNeto.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + parseFloat(valorTotal)).toFixed(2)
    })
}

function updateRodados(fecha) {
    axios.get('/contable/apiRodados/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let valorTotal = res.data.valorTotal
        let importeRodados = document.querySelector("#importeRodados")

        importeRodados.innerHTML = parseFloat(valorTotal).toFixed(2)
        importeTotalActivosNoCorrientes.innerHTML = (parseFloat(importeTotalActivosNoCorrientes.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalPasivosMasPatrimonioNeto.innerHTML = (parseFloat(importeTotalPasivosMasPatrimonioNeto.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + parseFloat(valorTotal)).toFixed(2)
    })
}

function updateTractores(fecha) {
    axios.get('/contable/apiTractores/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let valorTotal = res.data.valorTotal
        let importeTractores = document.querySelector("#importeTractores")

        importeTractores.innerHTML = parseFloat(valorTotal).toFixed(2)
        importeTotalActivosNoCorrientes.innerHTML = (parseFloat(importeTotalActivosNoCorrientes.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalPasivosMasPatrimonioNeto.innerHTML = (parseFloat(importeTotalPasivosMasPatrimonioNeto.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + parseFloat(valorTotal)).toFixed(2)
    })
}

function updateImplementos(fecha) {
    axios.get('/contable/apiImplementos/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let valorTotal = res.data.valorTotal
        let importeImplementos = document.querySelector("#importeImplementos")

        importeImplementos.innerHTML = parseFloat(valorTotal).toFixed(2)
        importeTotalActivosNoCorrientes.innerHTML = (parseFloat(importeTotalActivosNoCorrientes.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalPasivosMasPatrimonioNeto.innerHTML = (parseFloat(importeTotalPasivosMasPatrimonioNeto.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + parseFloat(valorTotal)).toFixed(2)
    })
}

function updateAutopropulsados(fecha) {
    axios.get('/contable/apiAutopropulsados/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let valorTotal = res.data.valorTotal
        let importeAutopropulsados = document.querySelector("#importeAutopropulsados")

        importeAutopropulsados.innerHTML = parseFloat(valorTotal).toFixed(2)
        importeTotalActivosNoCorrientes.innerHTML = (parseFloat(importeTotalActivosNoCorrientes.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalPasivosMasPatrimonioNeto.innerHTML = (parseFloat(importeTotalPasivosMasPatrimonioNeto.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + parseFloat(valorTotal)).toFixed(2)
    })
}

function updateLotes(fecha) {
    axios.get('/contable/apiLotes/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let valorTotal = res.data.valorTotal
        let importeLotes = document.querySelector("#importeLotes")

        importeLotes.innerHTML = parseFloat(valorTotal).toFixed(2)
        importeTotalActivosNoCorrientes.innerHTML = (parseFloat(importeTotalActivosNoCorrientes.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalPasivosMasPatrimonioNeto.innerHTML = (parseFloat(importeTotalPasivosMasPatrimonioNeto.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + parseFloat(valorTotal)).toFixed(2)
    })
}

function updateDeudasComerciales(fecha) {
    axios.get('/contable/apiDeudasComerciales/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let deudas = res.data
        let importeTotalDeudasComerciales = document.querySelector("#importeTotalDeudasComerciales");

        $("#divDeudasComerciales").html('')

        importeTotalDeudasComerciales.innerHTML = (0).toFixed(2)

        deudas.forEach(deuda => {
            $("#divDeudasComerciales").append(`
            <div class="form-row">
            <p class="col-md-7" style="margin-top: -15px">${ deuda.proveedor}</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ deuda.saldo.toFixed(2)}</p>
            </div>
            `)

            importeTotalDeudasComerciales.innerHTML = (parseFloat(importeTotalDeudasComerciales.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPasivosCorrientes.innerHTML = (parseFloat(importeTotalPasivosCorrientes.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPasivos.innerHTML = (parseFloat(importeTotalPasivos.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) - deuda.saldo).toFixed(2)
        });
    })
}

function updateDeudasFinancieras(fecha) {
    axios.get('/contable/apiDeudasFinancieras/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let deudas = res.data
        let importeTotalDeudasFinancieras = document.querySelector("#importeTotalDeudasFinancieras");

        $("#divDeudasFinancieras").html('')

        importeTotalDeudasFinancieras.innerHTML = (0).toFixed(2)

        deudas.forEach(deuda => {
            $("#divDeudasFinancieras").append(`
            <div class="form-row">
            <p class="col-md-7" style="margin-top: -15px">${ deuda.nombre}</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ deuda.saldo.toFixed(2)}</p>
            </div>
            `)

            importeTotalDeudasFinancieras.innerHTML = (parseFloat(importeTotalDeudasFinancieras.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPasivosCorrientes.innerHTML = (parseFloat(importeTotalPasivosCorrientes.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPasivos.innerHTML = (parseFloat(importeTotalPasivos.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) - deuda.saldo).toFixed(2)
        });
    })
}

function updateDeudasFiscales(fecha) {
    axios.get('/contable/apiDeudasFiscales/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let deudas = res.data
        let importeTotalDeudasFiscales = document.querySelector("#importeTotalDeudasFiscales");

        $("#divDeudasFiscales").html('')

        importeTotalDeudasFiscales.innerHTML = (0).toFixed(2)

        deudas.forEach(deuda => {
            $("#divDeudasFiscales").append(`
            <div class="form-row">
            <p class="col-md-7" style="margin-top: -15px">${ deuda.nombre}</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ deuda.saldo.toFixed(2)}</p>
            </div>
            `)

            importeTotalDeudasFiscales.innerHTML = (parseFloat(importeTotalDeudasFiscales.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPasivosCorrientes.innerHTML = (parseFloat(importeTotalPasivosCorrientes.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPasivos.innerHTML = (parseFloat(importeTotalPasivos.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) - deuda.saldo).toFixed(2)
        });
    })
}

function updateDeudasSociales(fecha) {
    axios.get('/contable/apiDeudasSociales/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let deudas = res.data
        let importeTotalDeudasSociales = document.querySelector("#importeTotalDeudasSociales");

        $("#divDeudasSociales").html('')

        importeTotalDeudasSociales.innerHTML = (0).toFixed(2)

        deudas.forEach(deuda => {
            $("#divDeudasSociales").append(`
            <div class="form-row">
            <p class="col-md-7" style="margin-top: -15px">${ deuda.nombre}</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ deuda.saldo.toFixed(2)}</p>
            </div>
            `)

            importeTotalDeudasSociales.innerHTML = (parseFloat(importeTotalDeudasSociales.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPasivosCorrientes.innerHTML = (parseFloat(importeTotalPasivosCorrientes.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPasivos.innerHTML = (parseFloat(importeTotalPasivos.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) - deuda.saldo).toFixed(2)
        });
    })
}

function updateDeudasOtras(fecha) {
    axios.get('/contable/apiDeudasOtras/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let deudas = res.data
        let importeTotalDeudasOtras = document.querySelector("#importeTotalDeudasOtras");

        $("#divDeudasOtras").html('')

        importeTotalDeudasOtras.innerHTML = (0).toFixed(2)

        deudas.forEach(deuda => {
            $("#divDeudasOtras").append(`
            <div class="form-row">
            <p class="col-md-7" style="margin-top: -15px">${ deuda.nombre}</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ deuda.saldo.toFixed(2)}</p>
            </div>
            `)

            importeTotalDeudasOtras.innerHTML = (parseFloat(importeTotalDeudasOtras.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPasivosCorrientes.innerHTML = (parseFloat(importeTotalPasivosCorrientes.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPasivos.innerHTML = (parseFloat(importeTotalPasivos.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) - deuda.saldo).toFixed(2)
        });
    })
}

function printReport() {
    const filename = 'Estado de Situación Patrimonial.pdf';
    let height = document.querySelector('#divESP').clientHeight
    let width = document.querySelector('#divESP').clientWidth

    let cabecera = '<div class="col-md-12 text-center mb-2"><h2><u>Estado de Situación Patrimonial al</u></h2></div>'
    let cuerpo = document.querySelector('#divESP')

    let pdf = new jsPDF('p', 'mm', 'a4');

    html2canvas(cuerpo).then(canvas => {
        pdf.addImage(canvas.toDataURL('image/png', 1), 'PNG', 15, 20, 180, (width * 180 / height));
        pdf.save(filename);
    });
}