var cultivos = document.querySelectorAll("#tabla-cultivos tbody tr");
var rubros = document.querySelectorAll("#tabla-rubros tbody tr");
var conceptos = document.querySelectorAll("#tabla-conceptos tbody tr");

cultivos.forEach(function (row) {
    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var cultivo = getElement(row);
            vista = document.querySelector("#editarCultivoModal");
            vista.querySelector("form").setAttribute("action", "/agriculturaDatosBase/cultivo/edit/" + cultivo.cultivoId);
            
            vista.querySelector("#nombreCultivo").value = cultivo.nombre;
         });
    }


    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var cultivo = getElement(row);
            vista = document.querySelector("#eliminarCultivoModal");
            vista.querySelector("form").setAttribute("action", "/agriculturaDatosBase/cultivo/delete/" + cultivo.cultivoId);
        });
    }
});

rubros.forEach(function (row) {
    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var rubro = getElement(row);
            vista = document.querySelector("#editarRubroModal");
            vista.querySelector("form").setAttribute("action", "/agriculturaDatosBase/rubro/edit/" + rubro.rubroId);
            
            vista.querySelector("#nombreRubro").value = rubro.nombre;
         });
    }


    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var rubro= getElement(row);
            vista = document.querySelector("#eliminarRubroModal");
            vista.querySelector("form").setAttribute("action", "/agriculturaDatosBase/rubro/delete/" + rubro.rubroId);
        });
    }
});

conceptos.forEach(function (row) {
    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var concepto = getElement(row);
            vista = document.querySelector("#editarConceptoModal");
            vista.querySelector("form").setAttribute("action", "/agriculturaDatosBase/concepto/edit/" + concepto.conceptoId);
            
            vista.querySelector("#nombreConcepto").value = concepto.nombre;
         });
    }


    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var concepto= getElement(row);
            vista = document.querySelector("#eliminarConceptoModal");
            vista.querySelector("form").setAttribute("action", "/agriculturaDatosBase/concepto/delete/" + concepto.conceptoId);
        });
    }
});


function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}