var lotes = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

lotes.forEach(function (rowLote) {
    var ver = rowLote.querySelector("#ver");
    ver.addEventListener("click", function () {
        var lote = getLote(rowLote);
        vista = document.querySelector("#verModal");
        vista.querySelector("#nombreLote").value = lote.nombre;
        vista.querySelector("#superficieLote").value = lote.superficie;
        vista.querySelector("#fechaCompraLote").value = lote.fechaCompra;
        vista.querySelector("#valorHectareaLote").value = lote.valorHectarea;
        vista.querySelector("#valorTotalLote").value = lote.valorLote;
    });

    var editar = rowLote.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var lote = getLote(rowLote);
            vista = document.querySelector("#editarModal");
            vista.querySelector("form").setAttribute("action", "/lotes/edit/" + lote.loteId);

            vista.querySelector("#nombreLote").value = lote.nombre;
            vista.querySelector("#superficieLote").value = lote.superficie;
            vista.querySelector("#fechaCompraLote").value = lote.fechaCompra;
            vista.querySelector("#valorHectareaLote").value = lote.valorHectarea;
        });
    }


    var eliminar = rowLote.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var lote = getLote(rowLote);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/lotes/delete/" + lote.loteId);
        });
    }
});

function getLote(rowLote) {
    var lote = JSON.parse(rowLote.attributes["data"].value);
    return lote;
}