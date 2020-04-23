var alumnos = document.querySelectorAll("table tbody tr");
var vista;

alumnos.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var alumno = getElement(row);
        vista = document.querySelector("#verModal");
        vista.querySelector("#userNombre").value = alumno.User.nombre;
        vista.querySelector("#userApellido").value = alumno.User.apellido;
        vista.querySelector("#userEmail").value = alumno.User.email;
        vista.querySelector("#userEmpresa").value = alumno.Empresa.nombre;
        vista.querySelector("#userAnioCursado").value = alumno.anioCursado;
        vista.querySelector("#userImgPerfil").src = (alumno.User.image) ? '/src/' + alumno.User.image : '/src/perfil.jpg';
    });

    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var alumno = getElement(row);
            vista = document.querySelector("#editarModal");
            vista.querySelector("form").setAttribute("action", "/auth/edit/" + alumno.User.userId);

            vista.querySelector("#userNombre").value = alumno.User.nombre;
            vista.querySelector("#userApellido").value = alumno.User.apellido;
            vista.querySelector("#userEmail").value = alumno.User.email;
        });
    }

    var baja = row.querySelector("#baja");
    if (baja) {
        baja.addEventListener("click", function () {
            var alumno = getElement(row);
            vista = document.querySelector("#bajaModal");
            vista.querySelector("form").setAttribute("action", "/auth/baja/" + alumno.User.userId);
        });
    }

    var deshacerBaja = row.querySelector("#deshacerBaja");
    if (deshacerBaja) {
        deshacerBaja.addEventListener("click", function () {
            var alumno = getElement(row);
            vista = document.querySelector("#deshacerBajaModal");
            vista.querySelector("form").setAttribute("action", "/auth/deshacerBaja/" + alumno.User.userId);
        });
    }

    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var alumno = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/auth/delete/" + alumno.User.userId);
        });
    }
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}