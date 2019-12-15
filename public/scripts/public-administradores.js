var administradores = document.querySelectorAll("table tbody tr");
var vista;

administradores.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var admin = getElement(row);
        vista = document.querySelector("#verModal");
        vista.querySelector("#userNombre").value = admin.nombre;
        vista.querySelector("#userApellido").value = admin.apellido;
        vista.querySelector("#userEmail").value = admin.email;
        vista.querySelector("#userImgPerfil").src = (admin.image) ? '/src/' + admin.image : '/src/perfil.jpg';
    });
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}