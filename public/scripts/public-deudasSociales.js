var deudas = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
        setMeses()
    })
}

deudas.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var deuda = getElement(row);
        vista = document.querySelector("#verModal");
        setMeses()

        vista.querySelector("#nombreDeudaSocial").value = deuda.nombre;
        vista.querySelector("#montoDeudaSocial").value = deuda.monto;
        vista.querySelector("#plazoDeudaSocial").value = deuda.plazo;
        vista.querySelector("#ejercicioDeudaSocial").value = deuda.porcEjercicio;
        vista.querySelector("#cuotasDeudaSocial").value = deuda.cantCuotas;
        vista.querySelector("#cuentaDeudaSocial").value = deuda.cuenta;
        vista.querySelector("#mes1DeudaSocial").checked = deuda.mes1;
        vista.querySelector("#mes2DeudaSocial").checked = deuda.mes2;
        vista.querySelector("#mes3DeudaSocial").checked = deuda.mes3;
        vista.querySelector("#mes4DeudaSocial").checked = deuda.mes4;
        vista.querySelector("#mes5DeudaSocial").checked = deuda.mes5;
        vista.querySelector("#mes6DeudaSocial").checked = deuda.mes6;
        vista.querySelector("#mes7DeudaSocial").checked = deuda.mes7;
        vista.querySelector("#mes8DeudaSocial").checked = deuda.mes8;
        vista.querySelector("#mes9DeudaSocial").checked = deuda.mes9;
        vista.querySelector("#mes10DeudaSocial").checked = deuda.mes10;
        vista.querySelector("#mes11DeudaSocial").checked = deuda.mes11;
        vista.querySelector("#mes12DeudaSocial").checked = deuda.mes12;
    })
    
    var editar = row.querySelector("#editar");
    editar.addEventListener("click", function () {
        var deuda = getElement(row);
        vista = document.querySelector("#editarModal");
        vista.querySelector("form").setAttribute("action", "/deudasSociales/edit/" + deuda.deudaSocialId);
        setMeses()
        
        vista.querySelector("#nombreDeudaSocial").value = deuda.nombre;
        vista.querySelector("#montoDeudaSocial").value = deuda.monto;
        vista.querySelector("#plazoDeudaSocial").value = deuda.plazo;
        vista.querySelector("#ejercicioDeudaSocial").value = deuda.porcEjercicio;
        vista.querySelector("#cuotasDeudaSocial").value = deuda.cantCuotas;
        vista.querySelector("#cuentaDeudaSocial").value = deuda.cuenta;
        vista.querySelector("#mes1DeudaSocial-edit").checked = deuda.mes1;
        vista.querySelector("#mes2DeudaSocial-edit").checked = deuda.mes2;
        vista.querySelector("#mes3DeudaSocial-edit").checked = deuda.mes3;
        vista.querySelector("#mes4DeudaSocial-edit").checked = deuda.mes4;
        vista.querySelector("#mes5DeudaSocial-edit").checked = deuda.mes5;
        vista.querySelector("#mes6DeudaSocial-edit").checked = deuda.mes6;
        vista.querySelector("#mes7DeudaSocial-edit").checked = deuda.mes7;
        vista.querySelector("#mes8DeudaSocial-edit").checked = deuda.mes8;
        vista.querySelector("#mes9DeudaSocial-edit").checked = deuda.mes9;
        vista.querySelector("#mes10DeudaSocial-edit").checked = deuda.mes10;
        vista.querySelector("#mes11DeudaSocial-edit").checked = deuda.mes11;
        vista.querySelector("#mes12DeudaSocial-edit").checked = deuda.mes12;
    })

    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var deuda = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/deudasSociales/delete/" + deuda.deudaSocialId);
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
    let cantCuotas = vista.querySelector("#cuotasDeudaSocial").value
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