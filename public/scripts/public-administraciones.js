var administraciones = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

administraciones.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var administracion = getElement(row);
        vista = document.querySelector("#verModal");
        vista.querySelector("#conceptoAdministracion").value = administracion.concepto;
        vista.querySelector("#fechaCompraAdministracion").value = administracion.fechaCompra;
        vista.querySelector("#fechaVentaAdministracion").value = administracion.fechaVenta;
        vista.querySelector("#cantidadAdministracion").value = administracion.cantidad;
        vista.querySelector("#unidadAdministracion").value = administracion.unidad;
        vista.querySelector("#valorAdministracion").value = administracion.valorUnitario;
        vista.querySelector("#valorMercadoAdministracion").value = administracion.valorMercado;
        vista.querySelector("#vidaUtilAdministracion").value = administracion.vidaUtil;
        vista.querySelector("#antiguedadAdministracion").value = administracion.antiguedad;
        vista.querySelector("#estadoAdministracion").value = administracion.estado;
        vista.querySelector("#amortizacionAdministracion").value = administracion.amortizacion;
        vista.querySelector("#amortizacionAcumuladaAdministracion").value = administracion.amortizacionAcumulada;
        vista.querySelector("#valorResidualAdministracion").value = administracion.valorResidual;
        vista.querySelector("#valorResidualMontoAdministracion").value = administracion.valorResidualMonto;
        vista.querySelector("#valorANuevoAdministracion").value = administracion.valorANuevo;
    });
    
    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var administracion = getElement(row);
            vista = document.querySelector("#editarModal");
            
            var radioCapital = vista.querySelector("#radioCapital");
            var radioCompra = vista.querySelector("#radioCompra");
            
            vista.querySelector("form").setAttribute("action", "/administraciones/edit/" + administracion.administracionId);
            
            vista.querySelector("#conceptoAdministracion").value = administracion.concepto;
            vista.querySelector("#fechaCompraAdministracion").value = administracion.fechaCompra;
            vista.querySelector("#cantidadAdministracion").value = administracion.cantidad;
            vista.querySelector("#unidadAdministracion").value = administracion.unidad;
            vista.querySelector("#valorAdministracion").value = administracion.valorUnitario;
            vista.querySelector("#vidaUtilAdministracion").value = administracion.vidaUtil;
            vista.querySelector("#estadoAdministracion").value = administracion.estado;
            vista.querySelector("#valorResidualAdministracion").value = administracion.valorResidual;


            axios.get('/apiMovimientos/getCompras/' + administracion.empresaId + '/Administracion/' + administracion.administracionId).then(res => {
                var movimientos = res.data.movimientos
                if (movimientos.length > 0) {
                    radioCapital.checked = false
                    radioCompra.checked = true

                    MC_updateFechaDeCompra(administracion.fechaCompra)
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
            var administracion = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/administraciones/delete/" + administracion.administracionId);
        });
    }

    var liquidar = row.querySelector("#liquidar");
    if (liquidar) {
        liquidar.addEventListener("click", function () {
            var administracion = getElement(row);
            vista = document.querySelector("#liquidarModal");
            vista.querySelector("form").setAttribute("action", "/administraciones/liquidar/" + administracion.administracionId);

            vista.querySelector("#valorVenta").value = administracion.valorANuevo
        });
    }

    var deshacerLiquidar = row.querySelector("#deshacerLiquidar");
    if (deshacerLiquidar) {
        deshacerLiquidar.addEventListener("click", function () {
            var administracion = getElement(row);
            vista = document.querySelector("#deshacerLiquidarModal");
            vista.querySelector("form").setAttribute("action", "/administraciones/deshacerLiquidar/" + administracion.administracionId);
        });
    }
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}


function MostrarCapital() {
    var fechaCompraAdministracion = vista.querySelector("#fechaCompraAdministracion")
    fechaCompraAdministracion.min = null
    fechaCompraAdministracion.max = datosEmpresa.inicioEjercicio
    ocultarMediosPago()
}

function MostrarCompra() {
    var fechaCompraAdministracion = vista.querySelector("#fechaCompraAdministracion")
    fechaCompraAdministracion.min = datosEmpresa.inicioEjercicio
    fechaCompraAdministracion.max = datosEmpresa.finEjercicio
    MC_updateFechaDeCompra(datosEmpresa.inicioEjercicio)
    mostrarMediosPago()
}

function actualizarValorTotal() {
    var cantidad = vista.querySelector("#cantidadAdministracion").value
    var valorUnidad = vista.querySelector("#valorAdministracion").value
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