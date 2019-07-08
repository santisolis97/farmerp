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
            vista.querySelector("#valorMercadoRodado").value = rodado.valorMercado;
            vista.querySelector("#vidaUtilRodado").value = rodado.vidaUtil;
            vista.querySelector("#estadoRodado").value = rodado.estado;
            vista.querySelector("#valorResidualRodado").value = rodado.valorResidual;
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