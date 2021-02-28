var tiposHacienda = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

tiposHacienda.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var tipoHacienda = getElement(row);
        vista = document.querySelector("#verModal");
        vista.querySelector("#nombreTipoHacienda").value = tipoHacienda.nombre;
        vista.querySelector("#mortandad").value = tipoHacienda.mortandad;
    });
    
    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var tipoHacienda = getElement(row);
            vista = document.querySelector("#editarModal");
            vista.querySelector("form").setAttribute("action", "/tiposHacienda/edit/" + tipoHacienda.tipoHaciendaId);
            
            vista.querySelector("#nombreTipoHacienda").value = tipoHacienda.nombre;
            vista.querySelector("#mortandad").value = tipoHacienda.mortandad;
        });
    }


    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var tipoHacienda = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/tiposHacienda/delete/" + tipoHacienda.tipoHaciendaId);
        });
    }
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}