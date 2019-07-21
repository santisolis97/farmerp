var tractores = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

tractores.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var tractor = getElement(row);
        vista = document.querySelector("#verModal");
        vista.querySelector("#conceptoTractor").value = tractor.concepto;
        vista.querySelector("#fechaCompraTractor").value = tractor.fechaCompra;
        vista.querySelector("#potenciaTractor").value = tractor.potencia;
        vista.querySelector("#valorTractor").value = tractor.valorUnitario;
        vista.querySelector("#vidaUtilTractor").value = tractor.vidaUtil;
        vista.querySelector("#antiguedadTractor").value = tractor.antiguedad;
        vista.querySelector("#estadoTractor").value = tractor.estado;
        vista.querySelector("#amortizacionTractor").value = tractor.amortizacion;
        vista.querySelector("#amortizacionAcumuladaTractor").value = tractor.amortizacionAcumulada;
        vista.querySelector("#valorResidualTractor").value = tractor.valorResidual;
        vista.querySelector("#valorResidualMontoTractor").value = tractor.valorResidualMonto;
        vista.querySelector("#valorANuevoTractor").value = tractor.valorANuevo;
    });

    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var tractor = getElement(row);
            vista = document.querySelector("#editarModal");
            vista.querySelector("form").setAttribute("action", "/tractores/edit/" + tractor.tractorId);

            vista.querySelector("#conceptoTractor").value = tractor.concepto;
            vista.querySelector("#fechaCompraTractor").value = tractor.fechaCompra;
            vista.querySelector("#potenciaTractor").value = tractor.potencia;
            vista.querySelector("#valorTractor").value = tractor.valorUnitario;
            vista.querySelector("#vidaUtilTractor").value = tractor.vidaUtil;
            vista.querySelector("#estadoTractor").value = tractor.estado;
            vista.querySelector("#valorResidualTractor").value = tractor.valorResidual;

            axios.get('/apiMovimientos/getCompras/' + tractor.empresaId + '/Tractor/' + tractor.tractorId).then(res => {
                var movimientos = res.data.movimientos
                if (movimientos.length > 0) {
                    radioCapital.checked = false
                    radioCompra.checked = true

                    MC_updateFechaDeCompra(tractor.fechaCompra)
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
            var tractor = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/tractores/delete/" + tractor.tractorId);
        });
    }

    var liquidar = row.querySelector("#liquidar");
    if (liquidar) {
        liquidar.addEventListener("click", function () {
            var tractor = getElement(row);
            vista = document.querySelector("#liquidarModal");
            vista.querySelector("form").setAttribute("action", "/tractores/liquidar/" + tractor.tractorId);

            vista.querySelector("#valorVenta").value = tractor.valorANuevo
        });
    }

    var deshacerLiquidar = row.querySelector("#deshacerLiquidar");
    if (deshacerLiquidar) {
        deshacerLiquidar.addEventListener("click", function () {
            var tractor = getElement(row);
            vista = document.querySelector("#deshacerLiquidarModal");
            vista.querySelector("form").setAttribute("action", "/tractores/deshacerLiquidar/" + tractor.tractorId);
        });
    }
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}

function MostrarCapital() {
    var fechaCompraTractor = vista.querySelector("#fechaCompraTractor")
    fechaCompraTractor.min = null
    fechaCompraTractor.max = datosEmpresa.inicioEjercicio
    ocultarMediosPago()
}

function MostrarCompra() {
    var fechaCompraTractor = vista.querySelector("#fechaCompraTractor")
    fechaCompraTractor.min = datosEmpresa.inicioEjercicio
    fechaCompraTractor.max = datosEmpresa.finEjercicio
    MC_updateFechaDeCompra(datosEmpresa.inicioEjercicio)
    mostrarMediosPago()
}

function actualizarValorTotal() {
    var valorUnidad = vista.querySelector("#valorTractor").value

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