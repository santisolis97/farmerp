var implementos = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

implementos.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var implemento = getElement(row);
        vista = document.querySelector("#verModal");
        vista.querySelector("#conceptoImplemento").value = implemento.concepto;
        vista.querySelector("#fechaCompraImplemento").value = implemento.fechaCompra;
        vista.querySelector("#utaImplemento").value = implemento.uta;
        vista.querySelector("#utaAcarreoImplemento").value = implemento.utaAcarreo;
        vista.querySelector("#valorImplemento").value = implemento.valorUnitario;
        vista.querySelector("#vidaUtilImplemento").value = implemento.vidaUtil;
        vista.querySelector("#antiguedadImplemento").value = implemento.antiguedad;
        vista.querySelector("#estadoImplemento").value = implemento.estado;
        vista.querySelector("#amortizacionImplemento").value = implemento.amortizacion;
        vista.querySelector("#amortizacionAcumuladaImplemento").value = implemento.amortizacionAcumulada;
        vista.querySelector("#valorResidualImplemento").value = implemento.valorResidual;
        vista.querySelector("#valorResidualMontoImplemento").value = implemento.valorResidualMonto;
        vista.querySelector("#valorANuevoImplemento").value = implemento.valorANuevo;
    });
    
    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var implemento = getElement(row);
            vista = document.querySelector("#editarModal");
            vista.querySelector("form").setAttribute("action", "/implementos/edit/" + implemento.implementoId);
            
            vista.querySelector("#conceptoImplemento").value = implemento.concepto;
            vista.querySelector("#fechaCompraImplemento").value = implemento.fechaCompra;
            vista.querySelector("#utaImplemento").value = implemento.uta;
            vista.querySelector("#utaAcarreoImplemento").value = implemento.utaAcarreo;
            vista.querySelector("#valorImplemento").value = implemento.valorUnitario;
            vista.querySelector("#vidaUtilImplemento").value = implemento.vidaUtil;
            vista.querySelector("#estadoImplemento").value = implemento.estado;
            vista.querySelector("#valorResidualImplemento").value = implemento.valorResidual;

            axios.get('/apiMovimientos/getCompras/' + implemento.empresaId + '/Implemento/' + implemento.implementoId).then(res => {
                var movimientos = res.data.movimientos
                if (movimientos.length > 0) {
                    var radioCompra = vista.querySelector("#radioCompra");
                    var radioCapital = vista.querySelector("#radioCapital");
                    
                    radioCapital.checked = false
                    radioCompra.checked = true

                    MC_updateFechaDeCompra(implemento.fechaCompra)
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
            var implemento = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/implementos/delete/" + implemento.implementoId);
        });
    }

    var liquidar = row.querySelector("#liquidar");
    if (liquidar) {
        liquidar.addEventListener("click", function () {
            var implemento = getElement(row);
            vista = document.querySelector("#liquidarModal");
            vista.querySelector("form").setAttribute("action", "/implementos/liquidar/" + implemento.implementoId);

            vista.querySelector("#valorVenta").value = implemento.valorANuevo
        });
    }

    var deshacerLiquidar = row.querySelector("#deshacerLiquidar");
    if (deshacerLiquidar) {
        deshacerLiquidar.addEventListener("click", function () {
            var implemento = getElement(row);
            vista = document.querySelector("#deshacerLiquidarModal");
            vista.querySelector("form").setAttribute("action", "/implementos/deshacerLiquidar/" + implemento.implementoId);
        });
    }
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}

function MostrarCapital() {
    var fechaCompraImplemento = vista.querySelector("#fechaCompraImplemento")
    fechaCompraImplemento.min = null
    fechaCompraImplemento.max = datosEmpresa.inicioEjercicio
    ocultarMediosPago()
}

function MostrarCompra() {
    var fechaCompraImplemento = vista.querySelector("#fechaCompraImplemento")
    fechaCompraImplemento.min = datosEmpresa.inicioEjercicio
    fechaCompraImplemento.max = datosEmpresa.finEjercicio
    MC_updateFechaDeCompra(datosEmpresa.inicioEjercicio)
    mostrarMediosPago()
}

function actualizarValorTotal() {
    var valorUnidad = vista.querySelector("#valorImplemento").value

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