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
        vista.querySelector("#cantidadInf").value = infraestructura.cantidad;
        vista.querySelector("#unidadInf").value = infraestructura.unidad;
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
            vista.querySelector("form").setAttribute("action", "/infraestructuras/edit/" + infraestructura.infraestructuraId);

            vista.querySelector("#conceptoInf").value = infraestructura.concepto;
            vista.querySelector("#fechaCompraInf").value = infraestructura.fechaCompra;
            vista.querySelector("#cantidadInf").value = infraestructura.cantidad;
            vista.querySelector("#unidadInf").value = infraestructura.unidad;
            vista.querySelector("#valorMercadoInf").value = infraestructura.valorMercado;
            vista.querySelector("#vidaUtilInf").value = infraestructura.vidaUtil;
            vista.querySelector("#estadoInf").value = infraestructura.estado;
            vista.querySelector("#valorResidualInf").value = infraestructura.valorResidual;
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
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}