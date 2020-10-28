var ganaderiaActividades = document.querySelectorAll("#tabla-ganaderiaActividades tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

ganaderiaActividades.forEach(function (row) {
    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var ganaderiaActividad = getElement(row);
            vista = document.querySelector("#editarModal");
            vista.querySelector("form").setAttribute("action", "/ganaderiaActividades/edit/" + ganaderiaActividad.actividadesId);
            
            vista.querySelector("#nombreganaderiaActividades").value = ganaderiaActividad.nombre;
            vista.querySelector("#superficieAsignadaganaderiaActividades").value = ganaderiaActividad.superficieAsignada;
            vista.querySelector("#cantidadganaderiaActividades").value = ganaderiaActividad.cantidad;
         });
    }

    var view = row.querySelector("#view");
    if (view) {
        view.addEventListener("click", function () {
            var ganaderiaActividad = getElement(row);
            vista = document.querySelector("#viewModal");
            vista.querySelector("form").setAttribute("action", "/ganaderiaActividades/view/" + ganaderiaActividad.actividadesId);
            
            vista.querySelector("#nombreganaderiaActividades").value = ganaderiaActividad.nombre;
            vista.querySelector("#superficieAsignadaganaderiaActividades").value = ganaderiaActividad.superficieAsignada;
            vista.querySelector("#cantidadganaderiaActividades").value = ganaderiaActividad.cantidad;
         });
    }

    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var ganaderiaActividad = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/ganaderiaActividades/delete/" + ganaderiaActividad.actividadesId);
        });
    }
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}