var ganaderiarubros = document.querySelectorAll("#tabla-ganaderiarubros tbody tr");
var ganaderiaconceptos = document.querySelectorAll("#tabla-ganaderiaconceptos tbody tr");
var vista;

ganaderiarubros.forEach(function (row) {
    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var ganaderiarubro = getElement(row);
            vista = document.querySelector("#editarRubroModal");
            vista.querySelector("form").setAttribute("action", "/ganaderiaDatosBase/rubro/edit/" + ganaderiarubro.rubroId);
            
            vista.querySelector("#nombreRubro").value = ganaderiarubro.nombre;
         });
    }


    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var ganaderiarubro= getElement(row);
            vista = document.querySelector("#eliminarRubroModal");
            vista.querySelector("form").setAttribute("action", "/ganaderiaDatosBase/rubro/delete/" + ganaderiarubro.rubroId);
        });
    }
});

ganaderiaconceptos.forEach(function (row) {
    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var ganaderiaconcepto = getElement(row);
            vista = document.querySelector("#editarConceptoModal");
            vista.querySelector("form").setAttribute("action", "/ganaderiaDatosBase/concepto/edit/" + ganaderiaconcepto.conceptoId);

            vista.querySelector("#nombreConcepto").value = ganaderiaconcepto.nombre;
            vista.querySelector("#precioConcepto").value = ganaderiaconcepto.precio;
            vista.querySelector("#unidad").value = ganaderiaconcepto.unidad;
            vista.querySelector("#porcIVAConcepto").value = ganaderiaconcepto.porcIVA;
            vista.querySelector("#mescompraconcepto").value = ganaderiaconcepto.mescompra;
         });
    }
    var view = row.querySelector("#view");
    if (view) {
        view.addEventListener("click", function () {
            var ganaderiaconcepto = getElement(row);
            vista = document.querySelector("#viewConceptoModal");
            vista.querySelector("form").setAttribute("action", "/ganaderiaDatosBase/concepto/view/" + ganaderiaconcepto.conceptoId);
            
            vista.querySelector("#nombreConcepto").value = ganaderiaconcepto.nombre;
            vista.querySelector("#precioConcepto").value = ganaderiaconcepto.precio;
            vista.querySelector("#unidad").value = ganaderiaconcepto.unidad;
            vista.querySelector("#porcIVAConcepto").value = ganaderiaconcepto.porcIVA;
            vista.querySelector("#mescompraconcepto").value = ganaderiaconcepto.mescompra;
         });
    }

    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var ganaderiaconcepto= getElement(row);
            vista = document.querySelector("#eliminarConceptoModal");
            vista.querySelector("form").setAttribute("action", "/ganaderiaDatosBase/concepto/delete/" + ganaderiaconcepto.conceptoId);
        });
    }
});


function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}