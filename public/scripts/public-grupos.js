var grupos = document.querySelectorAll("table tbody tr");
var vista;
var lineaUserId = 1

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
    })
}

grupos.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var grupo = getElement(row);
        vista = document.querySelector("#verModal");

    });

    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var grupo = getElement(row);
            vista = document.querySelector("#editarModal");

            //vista.querySelector("form").setAttribute("action", "/stocks/edit/" + grupo.stockId);

        });
    }


    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var grupo = getElement(row);
            vista = document.querySelector("#eliminarModal");
            //vista.querySelector("form").setAttribute("action", "/stocks/delete/" + grupo.stockId);
        });
    }
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}


function addLineaUser() {
    var line = `
    <div id="lineaUser-${ lineaUserId }" class="form-row">
        <div class="form-group col-md-3">
            <div class="input-group">
                <input type="text" name="users[${ lineaUserId }][nombre]" class="form-control" id="userNombre-${ lineaUserId }" placeholder="Nombre" required>
            </div>
        </div>

        <div class="form-group col-md-3">
            <div class="input-group">
                <input type="text" name="users[${ lineaUserId }][apellido]" class="form-control" id="userApellido-${ lineaUserId }" placeholder="Apellido" required>
            </div>
        </div>

        <div class="form-group col-md-5">
            <div class="input-group">
                <input type="email" name="users[${ lineaUserId }][email]" class="form-control" id="userEmail-${ lineaUserId }" placeholder="Email"  required>
            </div>
        </div>

        <div class="form-group ml-2 mt-2">
            <a class="text-danger" onclick="removeLineaUser(${ lineaUserId })"><i class="fa fa-trash"></i></a>
        </div>
    </div>
    `

    var divIntegrantes = vista.querySelector('#divIntegrantes');
    jQuery(divIntegrantes).append(line)
    lineaUserId += 1
}

function removeLineaUser(id) {
    jQuery("#lineaUser-" + id).remove()
}