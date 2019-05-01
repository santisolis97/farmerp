var alerta = document.getElementById('mensaje_alerta')

function Validate() {
    var password = document.getElementById("txtPassword").value;
    var confirmPassword = document.getElementById("txtConfirmPassword").value;
    if (password != confirmPassword) {
        alerta.classList.remove('d-none')
        return false;
    }
    return true;
}

function cerrarAlerta(){
    alerta.classList.add('d-none')
}
