var infraestructuras = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

infraestructuras.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var infraestructura = getElement(row);
        vista = document.querySelector("#verModal");
        vista.querySelector("#conceptoInf").value = infraestructura.concepto;
        vista.querySelector("#fechaCompraInf").value = infraestructura.fechaCompra;
        vista.querySelector("#fechaVentaInf").value = infraestructura.fechaVenta;
        vista.querySelector("#cantidadInf").value = infraestructura.cantidad;
        vista.querySelector("#unidadInf").value = infraestructura.unidad;
        vista.querySelector("#valorInf").value = infraestructura.valorUnitario;
        vista.querySelector("#valorMercadoInf").value = infraestructura.valorMercado;
        vista.querySelector("#vidaUtilInf").value = infraestructura.vidaUtil;
        vista.querySelector("#antiguedadInf").value = infraestructura.antiguedad;
        vista.querySelector("#estadoInf").value = infraestructura.estado;
        vista.querySelector("#amortizacionInf").value = infraestructura.amortizacion;
        vista.querySelector("#amortizacionAcumuladaInf").value = infraestructura.amortizacionAcumulada;
        vista.querySelector("#valorResidualInf").value = infraestructura.valorResidual;
        vista.querySelector("#valorResidualMontoInf").value = infraestructura.valorResidualMonto;
        vista.querySelector("#valorANuevoInf").value = infraestructura.valorANuevo;
    });
    
    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var infraestructura = getElement(row);
            vista = document.querySelector("#editarModal");
            
            var radioCapital = vista.querySelector("#radioCapital");
            var radioCompra = vista.querySelector("#radioCompra");
            
            vista.querySelector("form").setAttribute("action", "/infraestructuras/edit/" + infraestructura.infraestructuraId);
            
            vista.querySelector("#conceptoInf").value = infraestructura.concepto;
            vista.querySelector("#fechaCompraInf").value = infraestructura.fechaCompra;
            vista.querySelector("#cantidadInf").value = infraestructura.cantidad;
            vista.querySelector("#unidadInf").value = infraestructura.unidad;
            vista.querySelector("#valorInf").value = infraestructura.valorUnitario;
            vista.querySelector("#vidaUtilInf").value = infraestructura.vidaUtil;
            vista.querySelector("#estadoInf").value = infraestructura.estado;
            vista.querySelector("#valorResidualInf").value = infraestructura.valorResidual;


            axios.get('/apiMovimientos/getCompras/' + infraestructura.empresaId + '/Infraestructura/' + infraestructura.infraestructuraId).then(res => {
                var movimientos = res.data.movimientos
                if (movimientos.length > 0) {
                    radioCapital.checked = false
                    radioCompra.checked = true

                    MC_updateFechaDeCompra(infraestructura.fechaCompra)
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
            var infraestructura = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/infraestructuras/delete/" + infraestructura.infraestructuraId);
        });
    }

    var liquidar = row.querySelector("#liquidar");
    if (liquidar) {
        liquidar.addEventListener("click", function () {
            var infraestructura = getElement(row);
            vista = document.querySelector("#liquidarModal");
            vista.querySelector("form").setAttribute("action", "/infraestructuras/liquidar/" + infraestructura.infraestructuraId);

            vista.querySelector("#valorVenta").value = infraestructura.valorANuevo
        });
    }

    var deshacerLiquidar = row.querySelector("#deshacerLiquidar");
    if (deshacerLiquidar) {
        deshacerLiquidar.addEventListener("click", function () {
            var infraestructura = getElement(row);
            vista = document.querySelector("#deshacerLiquidarModal");
            vista.querySelector("form").setAttribute("action", "/infraestructuras/deshacerLiquidar/" + infraestructura.infraestructuraId);
        });
    }
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}


function MostrarCapital() {
    var fechaCompraInf = vista.querySelector("#fechaCompraInf")
    fechaCompraInf.min = null
    fechaCompraInf.max = datosEmpresa.inicioEjercicio
    ocultarMediosPago()
}

function MostrarCompra() {
    var fechaCompraInf = vista.querySelector("#fechaCompraInf")
    fechaCompraInf.min = datosEmpresa.inicioEjercicio
    fechaCompraInf.max = datosEmpresa.finEjercicio
    MC_updateFechaDeCompra(datosEmpresa.inicioEjercicio)
    mostrarMediosPago()
}

function actualizarValorTotal() {
    var cantidad = vista.querySelector("#cantidadInf").value
    var valorUnidad = vista.querySelector("#valorInf").value
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