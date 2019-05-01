
//Al presionar F2 te direcciona al manual del usuario
document.body.addEventListener("keydown", function (event) {
    if (event.keyCode == 113) {
        window.location.replace("/manualUsuario");
    }
});
