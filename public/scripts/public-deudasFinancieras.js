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

        vista.querySelector("#nombreDeudaFinanciera").value = deuda.nombre;
        vista.querySelector("#montoDeudaFinanciera").value = deuda.monto;
        vista.querySelector("#plazoDeudaFinanciera").value = deuda.plazo;
        vista.querySelector("#ejercicioDeudaFinanciera").value = deuda.porcEjercicio;
        vista.querySelector("#cuotasDeudaFinanciera").value = deuda.cantCuotas;
        vista.querySelector("#cuentaDeudaFinanciera").value = deuda.cuenta;
        vista.querySelector("#mes1DeudaFinanciera").checked = deuda.mes1;
        vista.querySelector("#mes2DeudaFinanciera").checked = deuda.mes2;
        vista.querySelector("#mes3DeudaFinanciera").checked = deuda.mes3;
        vista.querySelector("#mes4DeudaFinanciera").checked = deuda.mes4;
        vista.querySelector("#mes5DeudaFinanciera").checked = deuda.mes5;
        vista.querySelector("#mes6DeudaFinanciera").checked = deuda.mes6;
        vista.querySelector("#mes7DeudaFinanciera").checked = deuda.mes7;
        vista.querySelector("#mes8DeudaFinanciera").checked = deuda.mes8;
        vista.querySelector("#mes9DeudaFinanciera").checked = deuda.mes9;
        vista.querySelector("#mes10DeudaFinanciera").checked = deuda.mes10;
        vista.querySelector("#mes11DeudaFinanciera").checked = deuda.mes11;
        vista.querySelector("#mes12DeudaFinanciera").checked = deuda.mes12;
    })
    
    var editar = row.querySelector("#editar");
    editar.addEventListener("click", function () {
        var deuda = getElement(row);
        vista = document.querySelector("#editarModal");
        vista.querySelector("form").setAttribute("action", "/deudasFinancieras/edit/" + deuda.deudaFinancieraId);
        setMeses()
        
        vista.querySelector("#nombreDeudaFinanciera").value = deuda.nombre;
        vista.querySelector("#montoDeudaFinanciera").value = deuda.montoInicial;
        vista.querySelector("#plazoDeudaFinanciera").value = deuda.plazo;
        vista.querySelector("#ejercicioDeudaFinanciera").value = deuda.porcEjercicio;
        vista.querySelector("#cuotasDeudaFinanciera").value = deuda.cantCuotas;
        vista.querySelector("#cuentaDeudaFinanciera").value = deuda.cuenta;
        vista.querySelector("#mes1DeudaFinanciera-edit").checked = deuda.mes1;
        vista.querySelector("#mes2DeudaFinanciera-edit").checked = deuda.mes2;
        vista.querySelector("#mes3DeudaFinanciera-edit").checked = deuda.mes3;
        vista.querySelector("#mes4DeudaFinanciera-edit").checked = deuda.mes4;
        vista.querySelector("#mes5DeudaFinanciera-edit").checked = deuda.mes5;
        vista.querySelector("#mes6DeudaFinanciera-edit").checked = deuda.mes6;
        vista.querySelector("#mes7DeudaFinanciera-edit").checked = deuda.mes7;
        vista.querySelector("#mes8DeudaFinanciera-edit").checked = deuda.mes8;
        vista.querySelector("#mes9DeudaFinanciera-edit").checked = deuda.mes9;
        vista.querySelector("#mes10DeudaFinanciera-edit").checked = deuda.mes10;
        vista.querySelector("#mes11DeudaFinanciera-edit").checked = deuda.mes11;
        vista.querySelector("#mes12DeudaFinanciera-edit").checked = deuda.mes12;
    })

    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var deuda = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/deudasFinancieras/delete/" + deuda.deudaFinancieraId);
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
    let cantCuotas = vista.querySelector("#cuotasDeudaFinanciera").value
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