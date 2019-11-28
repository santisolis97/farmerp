var stocks = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

stocks.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var stock = getElement(row);
        vista = document.querySelector("#verModal");
        vista.querySelector("#productoStock").value = stock.producto;
        vista.querySelector("#detalleStock").value = stock.detalle;
        vista.querySelector("#unidadStock").value = stock.unidad;
        vista.querySelector("#cantidadStock").value = stock.cantidad;
        vista.querySelector("#valorUnitarioStock").value = stock.valorUnitario;
        vista.querySelector("#valorMercadoStock").value = stock.valorMercado;
    });
    
    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var stock = getElement(row);
            vista = document.querySelector("#editarModal");
            
            vista.querySelector("form").setAttribute("action", "/stocks/edit/" + stock.stockId);
            
            vista.querySelector("#productoStock").value = stock.producto;
            vista.querySelector("#detalleStock").value = stock.detalle;
            vista.querySelector("#unidadStock").value = stock.unidad;
            vista.querySelector("#cantidadStock").value = stock.cantidad;
            vista.querySelector("#valorUnitarioStock").value = stock.valorUnitario;
        });
    }


    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var stock = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/stocks/delete/" + stock.stockId);
        });
    }
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}