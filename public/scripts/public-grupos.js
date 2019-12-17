var grupos = document.querySelectorAll("table tbody tr");
var vista;
var lineaUserId = 1

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");

        lineaUserId = 1
    })
}

grupos.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var grupo = getElement(row);
        vista = document.querySelector("#verModal");

        lineaUserId = 1

        vista.querySelector("#nombreEmpresa").value = grupo.nombre
        vista.querySelector("#anioCursado").value = grupo.users[0].anioCursado

        let users = grupo.users
        for (let i = 0; i < users.length; i++) {
            const user = users[i].User;
            vista.querySelector("#userNombre-" + i).value = user.nombre
            vista.querySelector("#userApellido-" + i).value = user.apellido
            vista.querySelector("#userEmail-" + i).value = user.email

            if (i + 1 < users.length) {
                addLineaUserReadOnly()
            }
        }
    });

    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var grupo = getElement(row);
            vista = document.querySelector("#editarModal");

            vista.querySelector("form").setAttribute("action", "/grupos/edit/" + grupo.empresaId);

            lineaUserId = 1

            vista.querySelector("#nombreEmpresa").value = grupo.nombre
            vista.querySelector("#anioCursado").value = grupo.users[0].anioCursado

            let users = grupo.users
            for (let i = 0; i < users.length; i++) {
                const user = users[i].User;
                vista.querySelector("#userNombre-" + i).value = user.nombre
                vista.querySelector("#userApellido-" + i).value = user.apellido
                vista.querySelector("#userEmail-" + i).value = user.email

                if (i + 1 < users.length) {
                    addLineaUser()
                }
            }
        });
    }


    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var grupo = getElement(row);
            vista = document.querySelector("#eliminarModal");
            //vista.querySelector("form").setAttribute("action", "/grupos/delete/" + grupo.empresaId);
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

function addLineaUserReadOnly() {
    var line = `
    <div id="lineaUser-${ lineaUserId }" class="form-row">
        <div class="form-group col-md-3">
            <div class="input-group">
                <input type="text" name="users[${ lineaUserId }][nombre]" class="form-control" id="userNombre-${ lineaUserId }" placeholder="Nombre" readonly>
            </div>
        </div>

        <div class="form-group col-md-3">
            <div class="input-group">
                <input type="text" name="users[${ lineaUserId }][apellido]" class="form-control" id="userApellido-${ lineaUserId }" placeholder="Apellido" readonly>
            </div>
        </div>

        <div class="form-group col-md-5">
            <div class="input-group">
                <input type="email" name="users[${ lineaUserId }][email]" class="form-control" id="userEmail-${ lineaUserId }" placeholder="Email"  readonly>
            </div>
        </div>
    </div>
    `

    var divIntegrantes = vista.querySelector('#divIntegrantes');
    jQuery(divIntegrantes).append(line)
    lineaUserId += 1
}