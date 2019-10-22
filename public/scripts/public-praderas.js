var praderas = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

praderas.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var pradera = getElement(row);
        vista = document.querySelector("#verModal");
        vista.querySelector("#cultivoPradera").value = pradera.cultivo;
        vista.querySelector("#fechaImplantacionPradera").value = pradera.fechaImplantacion;
        vista.querySelector("#hectareasPradera").value = pradera.hectareas;
        vista.querySelector("#valorPradera").value = pradera.valorHectarea;
        vista.querySelector("#valorMercadoPradera").value = pradera.valorMercado;
        vista.querySelector("#vidaUtilPradera").value = pradera.vidaUtil;
        vista.querySelector("#antiguedadPradera").value = pradera.antiguedad;
        vista.querySelector("#estadoPradera").value = pradera.estado;
        vista.querySelector("#amortizacionPradera").value = pradera.amortizacion;
        vista.querySelector("#amortizacionAcumuladaPradera").value = pradera.amortizacionAcumulada;
        vista.querySelector("#valorResidualPradera").value = pradera.valorResidual;
        vista.querySelector("#valorResidualMontoPradera").value = pradera.valorResidualMonto;
        vista.querySelector("#valorANuevoPradera").value = pradera.valorANuevo;
    });
    
    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var pradera = getElement(row);
            vista = document.querySelector("#editarModal");
            
            vista.querySelector("form").setAttribute("action", "/praderas/edit/" + pradera.praderaId);
            
            vista.querySelector("#cultivoPradera").value = pradera.cultivo;
            vista.querySelector("#fechaImplantacionPradera").value = pradera.fechaImplantacion;
            vista.querySelector("#hectareasPradera").value = pradera.hectareas;
            vista.querySelector("#valorPradera").value = pradera.valorHectarea;
            vista.querySelector("#vidaUtilPradera").value = pradera.vidaUtil;
            vista.querySelector("#estadoPradera").value = pradera.estado;
            vista.querySelector("#valorResidualPradera").value = pradera.valorResidual;
        });
    }


    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var pradera = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/praderas/delete/" + pradera.praderaId);
        });
    }
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}