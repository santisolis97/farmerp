var retiroSocios = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
        setMeses()
    })
}

retiroSocios.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var retiroSocio = getElement(row);
        vista = document.querySelector("#verModal");
        setMeses()

        vista.querySelector("#nombreRetiroSocio").value = retiroSocio.nombre;
        vista.querySelector("#montoRetiroSocio").value = retiroSocio.monto;
        vista.querySelector("#plazoRetiroSocio").value = retiroSocio.plazo;
        vista.querySelector("#ejercicioRetiroSocio").value = retiroSocio.porcEjercicio;
        vista.querySelector("#cuotasRetiroSocio").value = retiroSocio.cantCuotas;
        vista.querySelector("#cuentaRetiroSocio").value = retiroSocio.cuenta;
        vista.querySelector("#mes1RetiroSocio").checked = retiroSocio.mes1;
        vista.querySelector("#mes2RetiroSocio").checked = retiroSocio.mes2;
        vista.querySelector("#mes3RetiroSocio").checked = retiroSocio.mes3;
        vista.querySelector("#mes4RetiroSocio").checked = retiroSocio.mes4;
        vista.querySelector("#mes5RetiroSocio").checked = retiroSocio.mes5;
        vista.querySelector("#mes6RetiroSocio").checked = retiroSocio.mes6;
        vista.querySelector("#mes7RetiroSocio").checked = retiroSocio.mes7;
        vista.querySelector("#mes8RetiroSocio").checked = retiroSocio.mes8;
        vista.querySelector("#mes9RetiroSocio").checked = retiroSocio.mes9;
        vista.querySelector("#mes10RetiroSocio").checked = retiroSocio.mes10;
        vista.querySelector("#mes11RetiroSocio").checked = retiroSocio.mes11;
        vista.querySelector("#mes12RetiroSocio").checked = retiroSocio.mes12;
    })
    
    var editar = row.querySelector("#editar");
    editar.addEventListener("click", function () {
        var retiroSocio = getElement(row);
        vista = document.querySelector("#editarModal");
        vista.querySelector("form").setAttribute("action", "/retiroSocios/edit/" + retiroSocio.retiroSocioId);
        setMeses()
        
        vista.querySelector("#nombreRetiroSocio").value = retiroSocio.nombre;
        vista.querySelector("#montoRetiroSocio").value = retiroSocio.monto;
        vista.querySelector("#plazoRetiroSocio").value = retiroSocio.plazo;
        vista.querySelector("#ejercicioRetiroSocio").value = retiroSocio.porcEjercicio;
        vista.querySelector("#cuotasRetiroSocio").value = retiroSocio.cantCuotas;
        vista.querySelector("#cuentaRetiroSocio").value = retiroSocio.cuenta;
        vista.querySelector("#mes1RetiroSocio-edit").checked = retiroSocio.mes1;
        vista.querySelector("#mes2RetiroSocio-edit").checked = retiroSocio.mes2;
        vista.querySelector("#mes3RetiroSocio-edit").checked = retiroSocio.mes3;
        vista.querySelector("#mes4RetiroSocio-edit").checked = retiroSocio.mes4;
        vista.querySelector("#mes5RetiroSocio-edit").checked = retiroSocio.mes5;
        vista.querySelector("#mes6RetiroSocio-edit").checked = retiroSocio.mes6;
        vista.querySelector("#mes7RetiroSocio-edit").checked = retiroSocio.mes7;
        vista.querySelector("#mes8RetiroSocio-edit").checked = retiroSocio.mes8;
        vista.querySelector("#mes9RetiroSocio-edit").checked = retiroSocio.mes9;
        vista.querySelector("#mes10RetiroSocio-edit").checked = retiroSocio.mes10;
        vista.querySelector("#mes11RetiroSocio-edit").checked = retiroSocio.mes11;
        vista.querySelector("#mes12RetiroSocio-edit").checked = retiroSocio.mes12;
    })

    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var retiroSocio = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/retiroSocios/delete/" + retiroSocio.retiroSocioId);
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
    let cantCuotas = vista.querySelector("#cuotasRetiroSocio").value
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