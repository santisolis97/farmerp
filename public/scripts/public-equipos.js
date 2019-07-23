var equipos = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

equipos.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var equipo = getElement(row);
        vista = document.querySelector("#verModal");
        vista.querySelector("#conceptoEquipo").value = equipo.concepto;
        vista.querySelector("#fechaCompraEquipo").value = equipo.fechaCompra;
        vista.querySelector("#utaEquipo").value = equipo.uta;
        vista.querySelector("#utaAcarreoEquipo").value = equipo.utaAcarreo;
        vista.querySelector("#valorEquipo").value = equipo.valorUnitario;
        vista.querySelector("#vidaUtilEquipo").value = equipo.vidaUtil;
        vista.querySelector("#antiguedadEquipo").value = equipo.antiguedad;
        vista.querySelector("#estadoEquipo").value = equipo.estado;
        vista.querySelector("#amortizacionEquipo").value = equipo.amortizacion;
        vista.querySelector("#amortizacionAcumuladaEquipo").value = equipo.amortizacionAcumulada;
        vista.querySelector("#valorResidualEquipo").value = equipo.valorResidual;
        vista.querySelector("#valorResidualMontoEquipo").value = equipo.valorResidualMonto;
        vista.querySelector("#valorANuevoEquipo").value = equipo.valorANuevo;
    });
    
    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var equipo = getElement(row);
            vista = document.querySelector("#editarModal");
            vista.querySelector("form").setAttribute("action", "/equipos/edit/" + equipo.equipoId);
            
            vista.querySelector("#conceptoEquipo").value = equipo.concepto;
            vista.querySelector("#fechaCompraEquipo").value = equipo.fechaCompra;
            vista.querySelector("#utaEquipo").value = equipo.uta;
            vista.querySelector("#utaAcarreoEquipo").value = equipo.utaAcarreo;
            vista.querySelector("#valorEquipo").value = equipo.valorUnitario;
            vista.querySelector("#vidaUtilEquipo").value = equipo.vidaUtil;
            vista.querySelector("#estadoEquipo").value = equipo.estado;
            vista.querySelector("#valorResidualEquipo").value = equipo.valorResidual;

            axios.get('/apiMovimientos/getCompras/' + equipo.empresaId + '/Equipo/' + equipo.equipoId).then(res => {
                var movimientos = res.data.movimientos
                if (movimientos.length > 0) {
                    radioCapital.checked = false
                    radioCompra.checked = true

                    MC_updateFechaDeCompra(equipo.fechaCompra)
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
            var equipo = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/equipos/delete/" + equipo.equipoId);
        });
    }

    var liquidar = row.querySelector("#liquidar");
    if (liquidar) {
        liquidar.addEventListener("click", function () {
            var equipo = getElement(row);
            vista = document.querySelector("#liquidarModal");
            vista.querySelector("form").setAttribute("action", "/equipos/liquidar/" + equipo.equipoId);

            vista.querySelector("#valorVenta").value = equipo.valorANuevo
        });
    }

    var deshacerLiquidar = row.querySelector("#deshacerLiquidar");
    if (deshacerLiquidar) {
        deshacerLiquidar.addEventListener("click", function () {
            var equipo = getElement(row);
            vista = document.querySelector("#deshacerLiquidarModal");
            vista.querySelector("form").setAttribute("action", "/equipos/deshacerLiquidar/" + equipo.equipoId);
        });
    }
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}

function MostrarCapital() {
    var fechaCompraEquipo = vista.querySelector("#fechaCompraEquipo")
    fechaCompraEquipo.min = null
    fechaCompraEquipo.max = datosEmpresa.inicioEjercicio
    ocultarMediosPago()
}

function MostrarCompra() {
    var fechaCompraEquipo = vista.querySelector("#fechaCompraEquipo")
    fechaCompraEquipo.min = datosEmpresa.inicioEjercicio
    fechaCompraEquipo.max = datosEmpresa.finEjercicio
    MC_updateFechaDeCompra(datosEmpresa.inicioEjercicio)
    mostrarMediosPago()
}

function actualizarValorTotal() {
    var valorUnidad = vista.querySelector("#valorEquipo").value

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