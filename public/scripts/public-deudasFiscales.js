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

        vista.querySelector("#nombreDeudaFiscal").value = deuda.nombre;
        vista.querySelector("#montoDeudaFiscal").value = deuda.monto;
        vista.querySelector("#plazoDeudaFiscal").value = deuda.plazo;
        vista.querySelector("#ejercicioDeudaFiscal").value = deuda.porcEjercicio;
        vista.querySelector("#cuotasDeudaFiscal").value = deuda.cantCuotas;
        vista.querySelector("#cuentaDeudaFiscal").value = deuda.cuenta;
        vista.querySelector("#mes1DeudaFiscal").checked = deuda.mes1;
        vista.querySelector("#mes2DeudaFiscal").checked = deuda.mes2;
        vista.querySelector("#mes3DeudaFiscal").checked = deuda.mes3;
        vista.querySelector("#mes4DeudaFiscal").checked = deuda.mes4;
        vista.querySelector("#mes5DeudaFiscal").checked = deuda.mes5;
        vista.querySelector("#mes6DeudaFiscal").checked = deuda.mes6;
        vista.querySelector("#mes7DeudaFiscal").checked = deuda.mes7;
        vista.querySelector("#mes8DeudaFiscal").checked = deuda.mes8;
        vista.querySelector("#mes9DeudaFiscal").checked = deuda.mes9;
        vista.querySelector("#mes10DeudaFiscal").checked = deuda.mes10;
        vista.querySelector("#mes11DeudaFiscal").checked = deuda.mes11;
        vista.querySelector("#mes12DeudaFiscal").checked = deuda.mes12;
    })
    
    var editar = row.querySelector("#editar");
    editar.addEventListener("click", function () {
        var deuda = getElement(row);
        vista = document.querySelector("#editarModal");
        vista.querySelector("form").setAttribute("action", "/deudasFiscales/edit/" + deuda.deudaFiscalId);
        setMeses()
        
        vista.querySelector("#nombreDeudaFiscal").value = deuda.nombre;
        vista.querySelector("#montoDeudaFiscal").value = deuda.monto;
        vista.querySelector("#plazoDeudaFiscal").value = deuda.plazo;
        vista.querySelector("#ejercicioDeudaFiscal").value = deuda.porcEjercicio;
        vista.querySelector("#cuotasDeudaFiscal").value = deuda.cantCuotas;
        vista.querySelector("#cuentaDeudaFiscal").value = deuda.cuenta;
        vista.querySelector("#mes1DeudaFiscal-edit").checked = deuda.mes1;
        vista.querySelector("#mes2DeudaFiscal-edit").checked = deuda.mes2;
        vista.querySelector("#mes3DeudaFiscal-edit").checked = deuda.mes3;
        vista.querySelector("#mes4DeudaFiscal-edit").checked = deuda.mes4;
        vista.querySelector("#mes5DeudaFiscal-edit").checked = deuda.mes5;
        vista.querySelector("#mes6DeudaFiscal-edit").checked = deuda.mes6;
        vista.querySelector("#mes7DeudaFiscal-edit").checked = deuda.mes7;
        vista.querySelector("#mes8DeudaFiscal-edit").checked = deuda.mes8;
        vista.querySelector("#mes9DeudaFiscal-edit").checked = deuda.mes9;
        vista.querySelector("#mes10DeudaFiscal-edit").checked = deuda.mes10;
        vista.querySelector("#mes11DeudaFiscal-edit").checked = deuda.mes11;
        vista.querySelector("#mes12DeudaFiscal-edit").checked = deuda.mes12;
    })

    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var deuda = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/deudasFiscales/delete/" + deuda.deudaFiscalId);
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
    let cantCuotas = vista.querySelector("#cuotasDeudaFiscal").value
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