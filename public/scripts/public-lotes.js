var lotes = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

lotes.forEach(function (rowLote) {
    var ver = rowLote.querySelector("#ver");
    ver.addEventListener("click", function () {
        var lote = getLote(rowLote);
        vista = document.querySelector("#verModal");
        vista.querySelector("#nombreLote").value = lote.nombre;
        vista.querySelector("#superficieLote").value = lote.superficie;
        vista.querySelector("#valorHectareaLote").value = lote.valorHectarea;
        vista.querySelector("#valorTotalLote").value = lote.valorLote;
        vista.querySelector("#fechaCompraLote").value = lote.fechaCompra;
        vista.querySelector("#fechaVentaLote").value = lote.fechaVenta;
    });

    var editar = rowLote.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var lote = getLote(rowLote);
            vista = document.querySelector("#editarModal");
            var radioCapital = vista.querySelector("#radioCapital");
            var radioCompra = vista.querySelector("#radioCompra");

            vista.querySelector("form").setAttribute("action", "/lotes/edit/" + lote.loteId);

            vista.querySelector("#nombreLote").value = lote.nombre;
            vista.querySelector("#superficieLote").value = lote.superficie;
            vista.querySelector("#valorHectareaLote").value = lote.valorHectarea;
            if (lote.fechaCompra) {
                radioCapital.checked = false
                radioCompra.checked = true

                vista.querySelector("#fechaCompraLote").value = lote.fechaCompra;
                MC_updateFechaDeCompra(lote.fechaCompra)
                MostrarCompra()
                actualizarValorLote()

                axios.get('/apiMovimientos/getCompras/' + lote.empresaId + '/Lote/' + lote.loteId).then(res => {
                    var movimientos = res.data.movimientos
                    if (i < movimientos.length) {
                    }
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
                })
            }
        });
    }


    var eliminar = rowLote.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var lote = getLote(rowLote);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/lotes/delete/" + lote.loteId);
        });
    }

    var liquidar = rowLote.querySelector("#liquidar");
    if (liquidar) {
        liquidar.addEventListener("click", function () {
            var lote = getLote(rowLote);
            vista = document.querySelector("#liquidarModal");
            vista.querySelector("form").setAttribute("action", "/lotes/liquidar/" + lote.loteId);

            vista.querySelector("#valorVenta").value = lote.valorLote
        });
    }

    var deshacerLiquidar = rowLote.querySelector("#deshacerLiquidar");
    if (deshacerLiquidar) {
        deshacerLiquidar.addEventListener("click", function () {
            var lote = getLote(rowLote);
            vista = document.querySelector("#deshacerLiquidarModal");
            vista.querySelector("form").setAttribute("action", "/lotes/deshacerLiquidar/" + lote.loteId);
        });
    }
});

function getLote(rowLote) {
    var lote = JSON.parse(rowLote.attributes["data"].value);
    return lote;
}

function MostrarCapital() {
    var fechaCompra = vista.querySelector("#fechaCompra")
    var fechaCompraLote = vista.querySelector("#fechaCompraLote")
    fechaCompra.value = null
    fechaCompraLote.required = false
    fechaCompra.classList.add('d-none')
    ocultarMediosPago()
}

function MostrarCompra() {
    var fechaCompra = vista.querySelector("#fechaCompra")
    var fechaCompraLote = vista.querySelector("#fechaCompraLote")
    fechaCompra.classList.remove('d-none')
    fechaCompraLote.required = true
    fechaCompraLote.valueAsDate = empresaInicioEjercicio
    MC_updateFechaDeCompra(empresaInicioEjercicio)
    mostrarMediosPago()
}

function actualizarValorLote() {
    var superficieLote = vista.querySelector("#superficieLote").value
    var valorHectareaLote = vista.querySelector("#valorHectareaLote").value
    if (superficieLote) {
        superficieLote = parseFloat(superficieLote)
    } else {
        superficieLote = 0
    }

    if (valorHectareaLote) {
        valorHectareaLote = parseFloat(valorHectareaLote)
    } else {
        valorHectareaLote = 0
    }

    updateTotalAPagar(superficieLote * valorHectareaLote)
}

function validateForm() {
    var radioCompra = vista.querySelector("#radioCompra");
    if (radioCompra.checked) {
        return validarPagos()
    } else {
        return true
    }
}