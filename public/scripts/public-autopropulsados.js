var autopropulsados = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

autopropulsados.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var autopropulsados = getElement(row);
        vista = document.querySelector("#verModal");
        vista.querySelector("#conceptoAutopropulsado").value = autopropulsados.concepto;
        vista.querySelector("#fechaCompraAutopropulsado").value = autopropulsados.fechaCompra;
        vista.querySelector("#potenciaAutopropulsado").value = autopropulsados.potencia;
        vista.querySelector("#utaAutopropulsado").value = autopropulsados.uta;
        vista.querySelector("#anchoTrabajoAutopropulsado").value = autopropulsados.anchoTrabajo;
        vista.querySelector("#valorAutopropulsado").value = autopropulsados.valorUnitario;
        vista.querySelector("#vidaUtilAutopropulsado").value = autopropulsados.vidaUtil;
        vista.querySelector("#antiguedadAutopropulsado").value = autopropulsados.antiguedad;
        vista.querySelector("#estadoAutopropulsado").value = autopropulsados.estado;
        vista.querySelector("#amortizacionAutopropulsado").value = autopropulsados.amortizacion;
        vista.querySelector("#amortizacionAcumuladaAutopropulsado").value = autopropulsados.amortizacionAcumulada;
        vista.querySelector("#valorResidualAutopropulsado").value = autopropulsados.valorResidual;
        vista.querySelector("#valorResidualMontoAutopropulsado").value = autopropulsados.valorResidualMonto;
        vista.querySelector("#valorANuevoAutopropulsado").value = autopropulsados.valorANuevo;
    });
    
    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var autopropulsados = getElement(row);
            vista = document.querySelector("#editarModal");
            vista.querySelector("form").setAttribute("action", "/autopropulsados/edit/" + autopropulsados.autopropulsadoId);
            
            vista.querySelector("#conceptoAutopropulsado").value = autopropulsados.concepto;
            vista.querySelector("#fechaCompraAutopropulsado").value = autopropulsados.fechaCompra;
            vista.querySelector("#potenciaAutopropulsado").value = autopropulsados.potencia;
            vista.querySelector("#utaAutopropulsado").value = autopropulsados.uta;
            vista.querySelector("#anchoTrabajoAutopropulsado").value = autopropulsados.anchoTrabajo;
            vista.querySelector("#valorAutopropulsado").value = autopropulsados.valorUnitario;
            vista.querySelector("#vidaUtilAutopropulsado").value = autopropulsados.vidaUtil;
            vista.querySelector("#estadoAutopropulsado").value = autopropulsados.estado;
            vista.querySelector("#valorResidualAutopropulsado").value = autopropulsados.valorResidual;

            axios.get('/apiMovimientos/getCompras/' + autopropulsados.empresaId + '/Autopropulsado/' + autopropulsados.autopropulsadoId).then(res => {
                var movimientos = res.data.movimientos
                if (movimientos.length > 0) {
                    var radioCompra = vista.querySelector("#radioCompra");
                    var radioCapital = vista.querySelector("#radioCapital");
                    
                    radioCapital.checked = false
                    radioCompra.checked = true

                    MC_updateFechaDeCompra(autopropulsados.fechaCompra)
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
    }


    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var autopropulsados = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/autopropulsados/delete/" + autopropulsados.autopropulsadoId);
        });
    }

    var liquidar = row.querySelector("#liquidar");
    if (liquidar) {
        liquidar.addEventListener("click", function () {
            var autopropulsados = getElement(row);
            vista = document.querySelector("#liquidarModal");
            vista.querySelector("form").setAttribute("action", "/autopropulsados/liquidar/" + autopropulsados.autopropulsadoId);

            vista.querySelector("#valorVenta").value = autopropulsados.valorANuevo
        });
    }

    var deshacerLiquidar = row.querySelector("#deshacerLiquidar");
    if (deshacerLiquidar) {
        deshacerLiquidar.addEventListener("click", function () {
            var autopropulsados = getElement(row);
            vista = document.querySelector("#deshacerLiquidarModal");
            vista.querySelector("form").setAttribute("action", "/autopropulsados/deshacerLiquidar/" + autopropulsados.autopropulsadoId);
        });
    }
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}

function MostrarCapital() {
    var fechaCompraAutopropulsado = vista.querySelector("#fechaCompraAutopropulsado")
    fechaCompraAutopropulsado.min = null
    fechaCompraAutopropulsado.max = datosEmpresa.inicioEjercicio
    ocultarMediosPago()
}

function MostrarCompra() {
    var fechaCompraAutopropulsado = vista.querySelector("#fechaCompraAutopropulsado")
    fechaCompraAutopropulsado.min = datosEmpresa.inicioEjercicio
    fechaCompraAutopropulsado.max = datosEmpresa.finEjercicio
    MC_updateFechaDeCompra(datosEmpresa.inicioEjercicio)
    mostrarMediosPago()
}

function actualizarValorTotal() {
    var valorUnidad = vista.querySelector("#valorAutopropulsado").value

    if (valorUnidad) {
        valorUnidad = parseFloat(valorUnidad)
    } else {
        valorUnidad = 0
    }

    updateTotalAPagar(valorUnidad)
}

function validateForm() {
    var radioCompra = vista.querySelector("#radioCompra");
    if (radioCompra.checked) {
        return validarPagos()
    } else {
        return true
    }
}