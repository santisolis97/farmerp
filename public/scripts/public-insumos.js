var insumos = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

insumos.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var insumo = getElement(row);
        vista = document.querySelector("#verModal");
        vista.querySelector("#conceptoInsumo").value = insumo.concepto;
        vista.querySelector("#cantidadInsumo").value = insumo.cantidad;
        vista.querySelector("#valorUnitarioInsumo").value = insumo.valorUnitario;
        vista.querySelector("#valorMercadoInsumo").value = insumo.valorMercado;
    });

    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var insumo = getElement(row);
            vista = document.querySelector("#editarModal");

            vista.querySelector("form").setAttribute("action", "/insumos/edit/" + insumo.insumoId);

            vista.querySelector("#conceptoInsumo").value = insumo.concepto;
            vista.querySelector("#cantidadInsumo").value = insumo.cantidad;
            vista.querySelector("#valorUnitarioInsumo").value = insumo.valorUnitario;
        });
    }


    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var insumo = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/insumos/delete/" + insumo.insumoId);
        });
    }
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}