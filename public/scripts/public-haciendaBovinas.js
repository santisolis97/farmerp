var haciendas = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

haciendas.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var hacienda = getElement(row);
        vista = document.querySelector("#verModal");
        vista.querySelector("#categoriaHaciendaBovina").value = hacienda.categoria;
        vista.querySelector("#fechaCompraHaciendaBovina").value = hacienda.fechaCompra;
        vista.querySelector("#fechaVentaHaciendaBovina").value = hacienda.fechaVenta;
        vista.querySelector("#cantidadHaciendaBovina").value = hacienda.cantidad;
        vista.querySelector("#kilogramoCabezaHaciendaBovina").value = hacienda.kilogramoCabeza;
        vista.querySelector("#valorKilogramoHaciendaBovina").value = hacienda.valorKilogramo;
        vista.querySelector("#valorMercadoHaciendaBovina").value = hacienda.antiguedad;
        vista.querySelector("#tipoBienHaciendaBovina").value = hacienda.tipoBien;
        vista.querySelector("#vidaUtilHaciendaBovina").value = hacienda.vidaUtil;
        vista.querySelector("#antiguedadHaciendaBovina").value = hacienda.antiguedad;
        vista.querySelector("#amortizacionHaciendaBovina").value = hacienda.amortizacion;
        vista.querySelector("#amortizacionAcumuladaHaciendaBovina").value = hacienda.amortizacionAcumulada;
        //vista.querySelector("#valorResidualhacienda").value = hacienda.valorResidual;
        //vista.querySelector("#valorResidualMontohacienda").value = hacienda.valorResidualMonto;
        //vista.querySelector("#valorANuevohacienda").value = hacienda.valorANuevo;
    });
    
    /* var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var hacienda = getElement(row);
            vista = document.querySelector("#editarModal");
            vista.querySelector("form").setAttribute("action", "/haciendas/edit/" + hacienda.haciendaId);
            
            vista.querySelector("#conceptohacienda").value = hacienda.concepto;
            vista.querySelector("#fechaCompraHaciendaBovina").value = hacienda.fechaCompra;
            vista.querySelector("#utahacienda").value = hacienda.uta;
            vista.querySelector("#utaAcarreohacienda").value = hacienda.utaAcarreo;
            vista.querySelector("#valorhacienda").value = hacienda.valorUnitario;
            vista.querySelector("#vidaUtilhacienda").value = hacienda.vidaUtil;
            vista.querySelector("#tipoBienhacienda").value = hacienda.tipoBien;
            vista.querySelector("#valorResidualhacienda").value = hacienda.valorResidual;

            axios.get('/apiMovimientos/getCompras/' + hacienda.empresaId + '/hacienda/' + hacienda.haciendaId).then(res => {
                var movimientos = res.data.movimientos
                if (movimientos.length > 0) {
                    radioCapital.checked = false
                    radioCompra.checked = true

                    MC_updateFechaDeCompra(hacienda.fechaCompra)
                    MostrarCompra()
                    actualizarValorTotal()
                    if (i < movimientos.length) {}
                    for (let i = 1; i < movimientos.length; i++) {
                        MC_addLineaCompra()
                    }
                    for (let i = 0; i < movimientos.length; i++) {
                        const movimiento = movimientos[i];
                        vista.querySelector("#MC_MedioDePago-" + i).value = movimiento.cuenta
                        vista.querySelector("#MC_CuentaId-" + i).value = movimiento.cuentaId
                        vista.querySelector("#MC_Monto-" + i).value = movimiento.monto
                    }
                    MC_updateSumaPagos()
                }
            })
        });
    } */


    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var hacienda = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/haciendaBovinas/delete/" + hacienda.haciendaId);
        });
    }

    var liquidar = row.querySelector("#liquidar");
    if (liquidar) {
        liquidar.addEventListener("click", function () {
            var hacienda = getElement(row);
            vista = document.querySelector("#liquidarModal");
            vista.querySelector("form").setAttribute("action", "/haciendaBovinas/liquidar/" + hacienda.haciendaId);
            
            vista.querySelector("#valorVenta").value = hacienda.valorANuevo
        });
    }
    
    var deshacerLiquidar = row.querySelector("#deshacerLiquidar");
    if (deshacerLiquidar) {
        deshacerLiquidar.addEventListener("click", function () {
            var hacienda = getElement(row);
            vista = document.querySelector("#deshacerLiquidarModal");
    
            vista.querySelector("form").setAttribute("action", "/haciendaBovinas/deshacerLiquidar/" + hacienda.haciendaId);
        });
    }
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}

function actualizarTipoBien(tipo){
    var vidaUtil = document.querySelector("#vidaUtil");
    var vidaUtilHaciendaBovina = document.querySelector("#vidaUtilHaciendaBovina");
    var fechaCompra = vista.querySelector("#fechaCompra")
    var fechaCompraHaciendaBovina = vista.querySelector("#fechaCompraHaciendaBovina")
    
    if (tipo == 'Bien de Uso'){
        vidaUtil.classList.remove('d-none')
        vidaUtilHaciendaBovina.required = true
        //fechaCompra.classList.remove('d-none')
        fechaCompraHaciendaBovina.required = true
    } else {
        vidaUtilHaciendaBovina.value = 0
        vidaUtilHaciendaBovina.required = false
        vidaUtil.classList.add('d-none')
        
        fechaCompraHaciendaBovina.value = null
        fechaCompraHaciendaBovina.required = false
        //fechaCompra.classList.add('d-none')
    }
}


function MostrarCapital() {
    var fechaCompraHaciendaBovina = vista.querySelector("#fechaCompraHaciendaBovina")
    
    fechaCompraHaciendaBovina.min = null
    fechaCompraHaciendaBovina.max = datosEmpresa.inicioEjercicio
    ocultarMediosPago()
}

function MostrarCompra() {
    //var fechaCompraHaciendaBovina = vista.querySelector("#fechaCompraHaciendaBovina")
    //var fechaCompra = vista.querySelector("#fechaCompra")
    
    //fechaCompra.classList.remove('d-none')
    fechaCompraHaciendaBovina.min = datosEmpresa.inicioEjercicio
    fechaCompraHaciendaBovina.max = datosEmpresa.finEjercicio
    MC_updateFechaDeCompra(datosEmpresa.inicioEjercicio)
    mostrarMediosPago()
}


function actualizarValorTotal() {
    var cantidadHaciendaBovina = vista.querySelector("#cantidadHaciedaBovina").value
    var kilogramoCabezaHaciedaBovina = vista.querySelector("#kilogramoCabezaHaciedaBovina").value
    var valorKilogramoHaciendaBovina = vista.querySelector("#valorKilogramoHaciendaBovina").value
    
    if (cantidadHaciendaBovina) {
        cantidadHaciendaBovina = parseFloat(cantidadHaciendaBovina)
    } else {
        cantidadHaciendaBovina = 0
    }
    
    if (kilogramoCabezaHaciedaBovina) {
        kilogramoCabezaHaciedaBovina = parseFloat(kilogramoCabezaHaciedaBovina)
    } else {
        kilogramoCabezaHaciedaBovina = 0
    }
    
    if (valorKilogramoHaciendaBovina) {
        valorKilogramoHaciendaBovina = parseFloat(valorKilogramoHaciendaBovina)
    } else {
        valorKilogramoHaciendaBovina = 0
    }
    
    updateTotalAPagar(cantidadHaciendaBovina * kilogramoCabezaHaciedaBovina * valorKilogramoHaciendaBovina)
}

function validateForm() {
    var radioCompra = vista.querySelector("#radioCompra");
    if (radioCompra.checked) {
        return validarPagos()
    } else {
        return true
    }
}