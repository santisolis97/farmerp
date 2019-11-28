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
    
    let importeDisponibilidades = document.querySelector("#importeDisponibilidades");
    let importeTotalActivos = document.querySelector("#importeTotalActivos");
    let importeTotalActivosCorrientes = document.querySelector("#importeTotalActivosCorrientes");
    let importeTotalActivosNoCorrientes = document.querySelector("#importeTotalActivosNoCorrientes");
    let importeTotalPasivosCorrientes = document.querySelector("#importeTotalPasivosCorrientes");
    let importeTotalPasivos = document.querySelector("#importeTotalPasivos");
    let importeTotalPatrimonioNeto = document.querySelector("#importeTotalPatrimonioNeto");

    importeDisponibilidades.innerHTML = (0).toFixed(2)
    importeTotalActivos.innerHTML = (0).toFixed(2)
    importeTotalActivosCorrientes.innerHTML = (0).toFixed(2)
    importeTotalActivosNoCorrientes.innerHTML = (0).toFixed(2)
    importeTotalPasivosCorrientes.innerHTML = (0).toFixed(2)
    importeTotalPasivos.innerHTML = (0).toFixed(2)
    importeTotalPatrimonioNeto.innerHTML = (0).toFixed(2)

    /* ACTIVOS */
    updateCaja(fecha)
    updateBanco(fecha)
    updateInversiones(fecha)
    updateCreditos(fecha)
    updateRetiroSocios(fecha)
    updateInsumos(fecha)
    updateInfraestructuras(fecha)
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
        $("#divCaja").append(`<p id="importeCaja" class="col-md-4 text-right" style="margin-top: -15px">$ ${ caja.saldo }</p>`)

        importeDisponibilidades.innerHTML = (parseFloat(importeDisponibilidades.innerHTML) + parseFloat(caja.saldo)).toFixed(2)
        importeTotalActivosCorrientes.innerHTML = (parseFloat(importeTotalActivosCorrientes.innerHTML) + parseFloat(caja.saldo)).toFixed(2)
        importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + parseFloat(caja.saldo)).toFixed(2)
        importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + parseFloat(caja.saldo)).toFixed(2)
    })
}

function updateBanco(fecha) {
    axios.get('/contable/apiBanco/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let banco = res.data
        $("#importeBanco").remove()
        $("#divBanco").append(`<p id="importeBanco" class="col-md-4 text-right" style="margin-top: -15px">$ ${ banco.saldo }</p>`)

        importeDisponibilidades.innerHTML = (parseFloat(importeDisponibilidades.innerHTML) + parseFloat(banco.saldo)).toFixed(2)
        importeTotalActivosCorrientes.innerHTML = (parseFloat(importeTotalActivosCorrientes.innerHTML) + parseFloat(banco.saldo)).toFixed(2)
        importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + parseFloat(banco.saldo)).toFixed(2)
        importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + parseFloat(banco.saldo)).toFixed(2)
    })
}

function updateInversiones(fecha) {
    axios.get('/contable/apiInversiones/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let inversiones = res.data
        $("#importeInversiones").remove()
        $("#divInversiones").append(`<p id="importeInversiones" class="col-md-4 text-right" style="margin-top: -15px">$ ${ inversiones.saldo }</p>`)

        importeDisponibilidades.innerHTML = (parseFloat(importeDisponibilidades.innerHTML) + parseFloat(inversiones.saldo)).toFixed(2)
        importeTotalActivosCorrientes.innerHTML = (parseFloat(importeTotalActivosCorrientes.innerHTML) + parseFloat(inversiones.saldo)).toFixed(2)
        importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + parseFloat(inversiones.saldo)).toFixed(2)
        importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + parseFloat(inversiones.saldo)).toFixed(2)
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
            <p class="col-md-7" style="margin-top: -15px">${ credito.nombre }</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ credito.saldo.toFixed(2) }</p>
            </div>
            `)

            importeTotalCreditos.innerHTML = (parseFloat(importeTotalCreditos.innerHTML) + credito.saldo).toFixed(2)
            importeTotalActivosCorrientes.innerHTML = (parseFloat(importeTotalActivosCorrientes.innerHTML) + credito.saldo).toFixed(2)
            importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + credito.saldo).toFixed(2)
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
            <p class="col-md-7" style="margin-top: -15px">${ retiro.nombre }</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ retiro.saldo.toFixed(2) * -1 }</p>
            </div>
            `)

            importeTotalRetiroSocios.innerHTML = (parseFloat(importeTotalRetiroSocios.innerHTML) - retiro.saldo).toFixed(2)
            importeTotalActivosCorrientes.innerHTML = (parseFloat(importeTotalActivosCorrientes.innerHTML) - retiro.saldo).toFixed(2)
            importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) - retiro.saldo).toFixed(2)
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
            <p class="col-md-7" style="margin-top: -15px">${ insumo.concepto }</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ insumo.valorMercado.toFixed(2) }</p>
            </div>
            `)

            importeTotalInsumos.innerHTML = (parseFloat(importeTotalInsumos.innerHTML) + insumo.valorMercado).toFixed(2)
            importeTotalActivosCorrientes.innerHTML = (parseFloat(importeTotalActivosCorrientes.innerHTML) + insumo.valorMercado).toFixed(2)
            importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + insumo.valorMercado).toFixed(2)
            importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + insumo.valorMercado).toFixed(2)
        });
    })
}


function updateInfraestructuras(fecha){
    axios.get('/contable/apiInfraestructuras/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let valorTotal = res.data.valorTotal
        let importeInfraestructura = document.querySelector("#importeInfraestructura")

        importeInfraestructura.innerHTML = parseFloat(valorTotal).toFixed(2)
        importeTotalActivosNoCorrientes.innerHTML = (parseFloat(importeTotalActivosNoCorrientes.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) + parseFloat(valorTotal)).toFixed(2)
    })
}

function updateLotes(fecha){
    axios.get('/contable/apiLotes/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
        let valorTotal = res.data.valorTotal
        let importeLotes = document.querySelector("#importeLotes")

        importeLotes.innerHTML = parseFloat(valorTotal).toFixed(2)
        importeTotalActivosNoCorrientes.innerHTML = (parseFloat(importeTotalActivosNoCorrientes.innerHTML) + parseFloat(valorTotal)).toFixed(2)
        importeTotalActivos.innerHTML = (parseFloat(importeTotalActivos.innerHTML) + parseFloat(valorTotal)).toFixed(2)
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
            <p class="col-md-7" style="margin-top: -15px">${ deuda.proveedor }</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ deuda.saldo.toFixed(2) }</p>
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
            <p class="col-md-7" style="margin-top: -15px">${ deuda.nombre }</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ deuda.saldo.toFixed(2) }</p>
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
            <p class="col-md-7" style="margin-top: -15px">${ deuda.nombre }</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ deuda.saldo.toFixed(2) }</p>
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
            <p class="col-md-7" style="margin-top: -15px">${ deuda.nombre }</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ deuda.saldo.toFixed(2) }</p>
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
            <p class="col-md-7" style="margin-top: -15px">${ deuda.nombre }</p>
            <p class="col-md-4 text-right" style="margin-top: -15px">$ ${ deuda.saldo.toFixed(2) }</p>
            </div>
            `)

            importeTotalDeudasOtras.innerHTML = (parseFloat(importeTotalDeudasOtras.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPasivosCorrientes.innerHTML = (parseFloat(importeTotalPasivosCorrientes.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPasivos.innerHTML = (parseFloat(importeTotalPasivos.innerHTML) + deuda.saldo).toFixed(2)
            importeTotalPatrimonioNeto.innerHTML = (parseFloat(importeTotalPatrimonioNeto.innerHTML) - deuda.saldo).toFixed(2)
        });
    })
}
