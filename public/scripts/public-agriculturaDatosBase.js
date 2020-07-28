var cultivos = document.querySelectorAll("#tabla-cultivos tbody tr");

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


function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}