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

        vista.querySelector("#nombreDeudaOtra").value = deuda.nombre;
        vista.querySelector("#montoDeudaOtra").value = deuda.monto;
        vista.querySelector("#plazoDeudaOtra").value = deuda.plazo;
        vista.querySelector("#ejercicioDeudaOtra").value = deuda.porcEjercicio;
        vista.querySelector("#cuotasDeudaOtra").value = deuda.cantCuotas;
        vista.querySelector("#cuentaDeudaOtra").value = deuda.cuenta;
        vista.querySelector("#mes1DeudaOtra").checked = deuda.mes1;
        vista.querySelector("#mes2DeudaOtra").checked = deuda.mes2;
        vista.querySelector("#mes3DeudaOtra").checked = deuda.mes3;
        vista.querySelector("#mes4DeudaOtra").checked = deuda.mes4;
        vista.querySelector("#mes5DeudaOtra").checked = deuda.mes5;
        vista.querySelector("#mes6DeudaOtra").checked = deuda.mes6;
        vista.querySelector("#mes7DeudaOtra").checked = deuda.mes7;
        vista.querySelector("#mes8DeudaOtra").checked = deuda.mes8;
        vista.querySelector("#mes9DeudaOtra").checked = deuda.mes9;
        vista.querySelector("#mes10DeudaOtra").checked = deuda.mes10;
        vista.querySelector("#mes11DeudaOtra").checked = deuda.mes11;
        vista.querySelector("#mes12DeudaOtra").checked = deuda.mes12;
    })
    
    var editar = row.querySelector("#editar");
    editar.addEventListener("click", function () {
        var deuda = getElement(row);
        vista = document.querySelector("#editarModal");
        vista.querySelector("form").setAttribute("action", "/otrasDeudas/edit/" + deuda.deudaOtraId);
        setMeses()
        
        vista.querySelector("#nombreDeudaOtra").value = deuda.nombre;
        vista.querySelector("#montoDeudaOtra").value = deuda.monto;
        vista.querySelector("#plazoDeudaOtra").value = deuda.plazo;
        vista.querySelector("#ejercicioDeudaOtra").value = deuda.porcEjercicio;
        vista.querySelector("#cuotasDeudaOtra").value = deuda.cantCuotas;
        vista.querySelector("#cuentaDeudaOtra").value = deuda.cuenta;
        vista.querySelector("#mes1DeudaOtra-edit").checked = deuda.mes1;
        vista.querySelector("#mes2DeudaOtra-edit").checked = deuda.mes2;
        vista.querySelector("#mes3DeudaOtra-edit").checked = deuda.mes3;
        vista.querySelector("#mes4DeudaOtra-edit").checked = deuda.mes4;
        vista.querySelector("#mes5DeudaOtra-edit").checked = deuda.mes5;
        vista.querySelector("#mes6DeudaOtra-edit").checked = deuda.mes6;
        vista.querySelector("#mes7DeudaOtra-edit").checked = deuda.mes7;
        vista.querySelector("#mes8DeudaOtra-edit").checked = deuda.mes8;
        vista.querySelector("#mes9DeudaOtra-edit").checked = deuda.mes9;
        vista.querySelector("#mes10DeudaOtra-edit").checked = deuda.mes10;
        vista.querySelector("#mes11DeudaOtra-edit").checked = deuda.mes11;
        vista.querySelector("#mes12DeudaOtra-edit").checked = deuda.mes12;
    })

    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var deuda = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/otrasDeudas/delete/" + deuda.deudaOtraId);
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
    let cantCuotas = vista.querySelector("#cuotasDeudaOtra").value
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