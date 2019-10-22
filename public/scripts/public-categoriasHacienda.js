var categoriasHacienda = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

categoriasHacienda.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var categoriaHacienda = getElement(row);
        vista = document.querySelector("#verModal");
        vista.querySelector("#tipoHaciendaNombre").value = categoriaHacienda.TipoHacienda.nombre;
        vista.querySelector("#nombreCategoriaHacienda").value = categoriaHacienda.nombre;
    });
    
    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var categoriaHacienda = getElement(row);
            vista = document.querySelector("#editarModal");
            vista.querySelector("form").setAttribute("action", "/categoriasHacienda/edit/" + categoriaHacienda.categoriaHaciendaId);
            
            vista.querySelector("#tipoCategoriaHacienda").value = categoriaHacienda.tipoHaciendaId;
            vista.querySelector("#nombreCategoriaHacienda").value = categoriaHacienda.nombre;
        });
    }


    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var categoriaHacienda = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/categoriasHacienda/delete/" + categoriaHacienda.categoriaHaciendaId);
        });
    }
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}