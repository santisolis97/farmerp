var rodados = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

rodados.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var rodado = getElement(row);
        vista = document.querySelector("#verModal");
        vista.querySelector("#conceptoRodado").value = rodado.concepto;
        vista.querySelector("#fechaCompraRodado").value = rodado.fechaCompra;
        vista.querySelector("#cantidadRodado").value = rodado.cantidad;
        vista.querySelector("#valorRodado").value = rodado.valorUnitario;
        vista.querySelector("#valorMercadoRodado").value = rodado.valorMercado;
        vista.querySelector("#vidaUtilRodado").value = rodado.vidaUtil;
        vista.querySelector("#antiguedadRodado").value = rodado.antiguedad;
        vista.querySelector("#estadoRodado").value = rodado.estado;
        vista.querySelector("#amortizacionRodado").value = rodado.amortizacion;
        vista.querySelector("#amortizacionAcumuladaRodado").value = rodado.amortizacionAcumulada;
        vista.querySelector("#valorResidualRodado").value = rodado.valorResidual;
        vista.querySelector("#valorResidualMontoRodado").value = rodado.valorResidualMonto;
        vista.querySelector("#valorANuevoRodado").value = rodado.valorANuevo;
    });

    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var rodado = getElement(row);
            vista = document.querySelector("#editarModal");
            vista.querySelector("form").setAttribute("action", "/rodados/edit/" + rodado.rodadoId);

            vista.querySelector("#conceptoRodado").value = rodado.concepto;
            vista.querySelector("#fechaCompraRodado").value = rodado.fechaCompra;
            vista.querySelector("#cantidadRodado").value = rodado.cantidad;
            vista.querySelector("#valorRodado").value = rodado.valorUnitario;
            vista.querySelector("#vidaUtilRodado").value = rodado.vidaUtil;
            vista.querySelector("#estadoRodado").value = rodado.estado;
            vista.querySelector("#valorResidualRodado").value = rodado.valorResidual;

            axios.get('/apiMovimientos/getCompras/' + rodado.empresaId + '/Rodado/' + rodado.rodadoId).then(res => {
                var movimientos = res.data.movimientos
                if (movimientos.length > 0) {
                    var radioCompra = vista.querySelector("#radioCompra");
                    var radioCapital = vista.querySelector("#radioCapital");
                    
                    radioCapital.checked = false
                    radioCompra.checked = true

                    MC_updateFechaDeCompra(rodado.fechaCompra)
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
            var rodado = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/rodados/delete/" + rodado.rodadoId);
        });
    }

    var liquidar = row.querySelector("#liquidar");
    if (liquidar) {
        liquidar.addEventListener("click", function () {
            var rodado = getElement(row);
            vista = document.querySelector("#liquidarModal");
            vista.querySelector("form").setAttribute("action", "/rodados/liquidar/" + rodado.rodadoId);

            vista.querySelector("#valorVenta").value = rodado.valorANuevo
        });
    }

    var deshacerLiquidar = row.querySelector("#deshacerLiquidar");
    if (deshacerLiquidar) {
        deshacerLiquidar.addEventListener("click", function () {
            var rodado = getElement(row);
            vista = document.querySelector("#deshacerLiquidarModal");
            vista.querySelector("form").setAttribute("action", "/rodados/deshacerLiquidar/" + rodado.rodadoId);
        });
    }
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}

function MostrarCapital() {
    var fechaCompraRodado = vista.querySelector("#fechaCompraRodado")
    fechaCompraRodado.min = null
    fechaCompraRodado.max = datosEmpresa.inicioEjercicio
    ocultarMediosPago()
}

function MostrarCompra() {
    var fechaCompraRodado = vista.querySelector("#fechaCompraRodado")
    fechaCompraRodado.min = datosEmpresa.inicioEjercicio
    fechaCompraRodado.max = datosEmpresa.finEjercicio
    MC_updateFechaDeCompra(datosEmpresa.inicioEjercicio)
    mostrarMediosPago()
}

function actualizarValorTotal() {
    var cantidad = vista.querySelector("#cantidadRodado").value
    var valorUnidad = vista.querySelector("#valorRodado").value
    if (cantidad) {
        cantidad = parseFloat(cantidad)
    } else {
        cantidad = 0
    }

    if (valorUnidad) {
        valorUnidad = parseFloat(valorUnidad)
    } else {
        valorUnidad = 0
    }

    updateTotalAPagar(cantidad * valorUnidad)
}

function validateForm() {
    var radioCompra = vista.querySelector("#radioCompra");
    if (radioCompra.checked) {
        return validarPagos()
    } else {
        return true
    }
}