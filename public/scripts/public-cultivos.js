var cultivos = document.querySelectorAll("#tabla-cultivos tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

cultivos.forEach(function (row) {
    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var cultivo = getElement(row);
            vista = document.querySelector("#editarModal");
            vista.querySelector("form").setAttribute("action", "/cultivos/edit/" + cultivo.cultivoId);
            
            vista.querySelector("#nombreCultivo").value = cultivo.nombre;
            vista.querySelector("#superficieAsignadaCultivo").value = cultivo.superficieAsignada;
            vista.querySelector("#rendimientoCultivo").value = cultivo.rendimiento;
            vista.querySelector("#precioPizarraCultivo").value = cultivo.precioPizarra;
            vista.querySelector("#porcGastosComerCultivo").value = cultivo.porcGastosComer;
            vista.querySelector("#porcVentaCultivo").value = cultivo.porcVenta;
            vista.querySelector("#porcAlmacenamientoCultivo").value = cultivo.porcAlmacenamiento;
            vista.querySelector("#porcDoblePropositoCultivo").value = cultivo.porcDobleProposito;
         });
    }

    var view = row.querySelector("#view");
    if (view) {
        view.addEventListener("click", function () {
            var cultivo = getElement(row);
            vista = document.querySelector("#viewModal");
            vista.querySelector("form").setAttribute("action", "/cultivos/view/" + cultivo.cultivoId);
            
            vista.querySelector("#nombreCultivo").value = cultivo.nombre;
            vista.querySelector("#superficieAsignadaCultivo").value = cultivo.superficieAsignada;
            vista.querySelector("#rendimientoCultivo").value = cultivo.rendimiento;
            vista.querySelector("#precioPizarraCultivo").value = cultivo.precioPizarra;
            vista.querySelector("#porcGastosComerCultivo").value = cultivo.porcGastosComer;
            vista.querySelector("#porcVentaCultivo").value = cultivo.porcVenta;
            vista.querySelector("#porcAlmacenamientoCultivo").value = cultivo.porcAlmacenamiento;
            vista.querySelector("#porcDoblePropositoCultivo").value = cultivo.porcDobleProposito;
         });
    }

    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var cultivo = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/cultivos/delete/" + cultivo.cultivoId);
        });
    }
});


function updateDobleProposito(){
    var porcVentaCultivo = vista.querySelector("#porcVentaCultivo").value
    var porcAlmacenamientoCultivo = vista.querySelector("#porcAlmacenamientoCultivo").value
    var porcDoblePropositoCultivo = vista.querySelector("#porcDoblePropositoCultivo")

    porcDoblePropositoCultivo.value = 100 - (isNaN(porcVentaCultivo) ? 0 : porcVentaCultivo) - (isNaN(porcAlmacenamientoCultivo) ? 0 : porcAlmacenamientoCultivo) 
}

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}