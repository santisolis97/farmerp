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
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}