var creditos = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
        setMeses()
    })
}

creditos.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var credito = getElement(row);
        vista = document.querySelector("#verModal");
        setMeses()

        vista.querySelector("#nombreCredito").value = credito.nombre;
        vista.querySelector("#montoCredito").value = credito.monto;
        vista.querySelector("#plazoCredito").value = credito.plazo;
        vista.querySelector("#ejercicioCredito").value = credito.porcEjercicio;
        vista.querySelector("#cuotasCredito").value = credito.cantCuotas;
        vista.querySelector("#cuentaCredito").value = credito.cuenta;
        vista.querySelector("#mes1Credito").checked = credito.mes1;
        vista.querySelector("#mes2Credito").checked = credito.mes2;
        vista.querySelector("#mes3Credito").checked = credito.mes3;
        vista.querySelector("#mes4Credito").checked = credito.mes4;
        vista.querySelector("#mes5Credito").checked = credito.mes5;
        vista.querySelector("#mes6Credito").checked = credito.mes6;
        vista.querySelector("#mes7Credito").checked = credito.mes7;
        vista.querySelector("#mes8Credito").checked = credito.mes8;
        vista.querySelector("#mes9Credito").checked = credito.mes9;
        vista.querySelector("#mes10Credito").checked = credito.mes10;
        vista.querySelector("#mes11Credito").checked = credito.mes11;
        vista.querySelector("#mes12Credito").checked = credito.mes12;
    })
    
    var editar = row.querySelector("#editar");
    editar.addEventListener("click", function () {
        var credito = getElement(row);
        vista = document.querySelector("#editarModal");
        vista.querySelector("form").setAttribute("action", "/creditos/edit/" + credito.creditoId);
        setMeses()
        
        vista.querySelector("#nombreCredito").value = credito.nombre;
        vista.querySelector("#montoCredito").value = credito.monto;
        vista.querySelector("#plazoCredito").value = credito.plazo;
        vista.querySelector("#ejercicioCredito").value = credito.porcEjercicio;
        vista.querySelector("#cuotasCredito").value = credito.cantCuotas;
        vista.querySelector("#cuentaCredito").value = credito.cuenta;
        vista.querySelector("#mes1Credito-edit").checked = credito.mes1;
        vista.querySelector("#mes2Credito-edit").checked = credito.mes2;
        vista.querySelector("#mes3Credito-edit").checked = credito.mes3;
        vista.querySelector("#mes4Credito-edit").checked = credito.mes4;
        vista.querySelector("#mes5Credito-edit").checked = credito.mes5;
        vista.querySelector("#mes6Credito-edit").checked = credito.mes6;
        vista.querySelector("#mes7Credito-edit").checked = credito.mes7;
        vista.querySelector("#mes8Credito-edit").checked = credito.mes8;
        vista.querySelector("#mes9Credito-edit").checked = credito.mes9;
        vista.querySelector("#mes10Credito-edit").checked = credito.mes10;
        vista.querySelector("#mes11Credito-edit").checked = credito.mes11;
        vista.querySelector("#mes12Credito-edit").checked = credito.mes12;
    })

    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var credito = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/creditos/delete/" + credito.creditoId);
        });
    }
});


function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}







function setMeses() {
    let mes = empresaInicioEjercicio.getMonth()
    let anio = empresaInicioEjercicio.getFullYear()
    let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    for (let i = 1; i < 13; i++) {
        if (!(mes < 12)) {
            mes = 0
            anio += 1
        }
        let label = meses[mes] + ' ' + anio
        jQuery(vista.querySelector("#mes" + i + "Label")).append(label)
        mes += 1
    }
}

function validateForm(){
    let cantCuotas = vista.querySelector("#cuotasCredito").value
    let checkboxes = vista.querySelectorAll('input[type=checkbox]')
    let cantCB = 0
    checkboxes.forEach(cb => {
       if (cb.checked){
           cantCB += 1
       } 
    });
    if (cantCuotas == cantCB){
        return true
    } else {
        alert('La cantidad de meses seleccionados no coincide con la cantidad de cuotas')
        return false
    }
}