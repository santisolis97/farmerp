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

        vista.querySelector("#nombreDeudaComercial").value = deuda.proveedor;
        vista.querySelector("#montoDeudaComercial").value = deuda.monto;
        vista.querySelector("#plazoDeudaComercial").value = deuda.plazo;
        vista.querySelector("#ejercicioDeudaComercial").value = deuda.porcEjercicio;
        vista.querySelector("#cuotasDeudaComercial").value = deuda.cantCuotas;
        vista.querySelector("#cuentaDeudaComercial").value = deuda.cuenta;
        vista.querySelector("#mes1DeudaComercial").checked = deuda.mes1;
        vista.querySelector("#mes2DeudaComercial").checked = deuda.mes2;
        vista.querySelector("#mes3DeudaComercial").checked = deuda.mes3;
        vista.querySelector("#mes4DeudaComercial").checked = deuda.mes4;
        vista.querySelector("#mes5DeudaComercial").checked = deuda.mes5;
        vista.querySelector("#mes6DeudaComercial").checked = deuda.mes6;
        vista.querySelector("#mes7DeudaComercial").checked = deuda.mes7;
        vista.querySelector("#mes8DeudaComercial").checked = deuda.mes8;
        vista.querySelector("#mes9DeudaComercial").checked = deuda.mes9;
        vista.querySelector("#mes10DeudaComercial").checked = deuda.mes10;
        vista.querySelector("#mes11DeudaComercial").checked = deuda.mes11;
        vista.querySelector("#mes12DeudaComercial").checked = deuda.mes12;
    })
    
    var editar = row.querySelector("#editar");
    editar.addEventListener("click", function () {
        var deuda = getElement(row);
        vista = document.querySelector("#editarModal");
        vista.querySelector("form").setAttribute("action", "/deudasComerciales/edit/" + deuda.deudaComercialId);
        setMeses()
        
        vista.querySelector("#nombreDeudaComercial").value = deuda.proveedor;
        vista.querySelector("#montoDeudaComercial").value = deuda.monto;
        vista.querySelector("#plazoDeudaComercial").value = deuda.plazo;
        vista.querySelector("#ejercicioDeudaComercial").value = deuda.porcEjercicio;
        vista.querySelector("#cuotasDeudaComercial").value = deuda.cantCuotas;
        vista.querySelector("#cuentaDeudaComercial").value = deuda.cuenta;
        vista.querySelector("#mes1DeudaComercial-edit").checked = deuda.mes1;
        vista.querySelector("#mes2DeudaComercial-edit").checked = deuda.mes2;
        vista.querySelector("#mes3DeudaComercial-edit").checked = deuda.mes3;
        vista.querySelector("#mes4DeudaComercial-edit").checked = deuda.mes4;
        vista.querySelector("#mes5DeudaComercial-edit").checked = deuda.mes5;
        vista.querySelector("#mes6DeudaComercial-edit").checked = deuda.mes6;
        vista.querySelector("#mes7DeudaComercial-edit").checked = deuda.mes7;
        vista.querySelector("#mes8DeudaComercial-edit").checked = deuda.mes8;
        vista.querySelector("#mes9DeudaComercial-edit").checked = deuda.mes9;
        vista.querySelector("#mes10DeudaComercial-edit").checked = deuda.mes10;
        vista.querySelector("#mes11DeudaComercial-edit").checked = deuda.mes11;
        vista.querySelector("#mes12DeudaComercial-edit").checked = deuda.mes12;
    })

    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var deuda = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/deudasComerciales/delete/" + deuda.deudaComercialId);
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
    let cantCuotas = vista.querySelector("#cuotasDeudaComercial").value
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