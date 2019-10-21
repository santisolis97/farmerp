var haciendas = document.querySelectorAll("table tbody tr");
var vista;

var agregar = document.querySelector("#agregar");
if (agregar) {
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");

        var tipoHaciendaId = vista.querySelector("#tipoHacienda").value
        updateCategoriasList(tipoHaciendaId)
    })
}

haciendas.forEach(function (row) {
    var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var hacienda = getElement(row);
        vista = document.querySelector("#verModal");
        
        vista.querySelector("#tipoHacienda").value = hacienda.TipoHacienda.nombre;
        vista.querySelector("#categoriaHacienda").value = hacienda.CategoriaHacienda.nombre;
        vista.querySelector("#fechaCompraHacienda").value = hacienda.fechaCompra;
        vista.querySelector("#fechaVentaHacienda").value = hacienda.fechaVenta;
        vista.querySelector("#cantidadHacienda").value = hacienda.cantidad;
        vista.querySelector("#kilogramoCabezaHacienda").value = hacienda.kilogramoCabeza;
        vista.querySelector("#valorKilogramoHacienda").value = hacienda.valorKilogramo;
        vista.querySelector("#valorMercadoHacienda").value = hacienda.valorMercado;
        vista.querySelector("#tipoBienHacienda").value = hacienda.tipoBien;
        vista.querySelector("#vidaUtilHacienda").value = hacienda.vidaUtil;
        vista.querySelector("#antiguedadHacienda").value = hacienda.antiguedad;
        vista.querySelector("#amortizacionHacienda").value = hacienda.amortizacion;
        vista.querySelector("#amortizacionAcumuladaHacienda").value = hacienda.amortizacionAcumulada;
    });
    
    var editar = row.querySelector("#editar");
    if (editar) {
        editar.addEventListener("click", function () {
            var hacienda = getElement(row);
            vista = document.querySelector("#editarModal");
            vista.querySelector("form").setAttribute("action", "/haciendas/edit/" + hacienda.haciendaId);
            
            vista.querySelector("#tipoHacienda").value = hacienda.tipoHaciendaId;

            axios.get('/categoriasHacienda/api/tipo/' + hacienda.tipoHaciendaId).then(res => {
                var categorias = res.data.categorias
                var selectCategorias = vista.querySelector("#categoriaHacienda")
                
                categorias.forEach(categoria => {
                    $(selectCategorias).append('<option value="'+ categoria.categoriaHaciendaId +'">'+ categoria.nombre +'</option>')
                })
                
                vista.querySelector("#categoriaHacienda").value = hacienda.categoriaHaciendaId;
            })
            
            vista.querySelector("#cantidadHacienda").value = hacienda.cantidad;
            vista.querySelector("#kilogramoCabezaHacienda").value = hacienda.kilogramoCabeza;
            vista.querySelector("#valorKilogramoHacienda").value = hacienda.valorKilogramo;
            vista.querySelector("#tipoBienHacienda").value = hacienda.tipoBien;
            vista.querySelector("#vidaUtilHacienda").value = hacienda.vidaUtil;
            vista.querySelector("#fechaCompraHacienda").value = hacienda.fechaCompra;

            axios.get('/apiMovimientos/getCompras/' + hacienda.empresaId + '/hacienda/' + hacienda.haciendaId).then(res => {
                var movimientos = res.data.movimientos
                if (movimientos.length > 0) {
                    var radioCompra = vista.querySelector("#radioCompra");
                    var radioCapital = vista.querySelector("#radioCapital");

                    radioCapital.checked = false
                    radioCompra.checked = true

                    MC_updateFechaDeCompra(hacienda.fechaCompra)
                    MostrarCompra()
                    actualizarValorTotal()
                    if (i < movimientos.length) {}
                    for (let i = 1; i < movimientos.length; i++) {
                        MC_addLineaCompra()
                    }
                    for (let i = 0; i < movimientos.length; i++) {
                        const movimiento = movimientos[i];
                        vista.querySelector("#MC_MedioDePago-" + i).value = movimiento.cuenta
                        vista.querySelector("#MC_CuentaId-" + i).value = movimiento.cuentaId
                        vista.querySelector("#MC_Monto-" + i).value = movimiento.monto
                    }
                    MC_updateSumaPagos()
                }
            })
        });
    }


    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var hacienda = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action", "/haciendas/delete/" + hacienda.haciendaId);
        });
    }

    var liquidar = row.querySelector("#liquidar");
    if (liquidar) {
        liquidar.addEventListener("click", function () {
            var hacienda = getElement(row);
            vista = document.querySelector("#liquidarModal");
            vista.querySelector("form").setAttribute("action", "/haciendas/liquidar/" + hacienda.haciendaId);
            
            vista.querySelector("#valorVenta").value = hacienda.valorANuevo
        });
    }
    
    var deshacerLiquidar = row.querySelector("#deshacerLiquidar");
    if (deshacerLiquidar) {
        deshacerLiquidar.addEventListener("click", function () {
            var hacienda = getElement(row);
            vista = document.querySelector("#deshacerLiquidarModal");
    
            vista.querySelector("form").setAttribute("action", "/haciendas/deshacerLiquidar/" + hacienda.haciendaId);
        });
    }
});

function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}

function updateCategoriasList(tipoHaciendaId){
    axios.get('/categoriasHacienda/api/tipo/' + tipoHaciendaId).then(res => {
        var categorias = res.data.categorias
        var selectCategorias = vista.querySelector("#categoriaHacienda")
        
        categorias.forEach(categoria => {
            $(selectCategorias).append('<option value="'+ categoria.categoriaHaciendaId +'">'+ categoria.nombre +'</option>')
        })
    })
}


function actualizarTipoBien(tipo){
    var vidaUtil = document.querySelector("#vidaUtil");
    var vidaUtilHacienda = document.querySelector("#vidaUtilHacienda");
    var fechaCompra = vista.querySelector("#fechaCompra")
    var fechaCompraHacienda = vista.querySelector("#fechaCompraHacienda")
    
    if (tipo == 'Bien de Uso'){
        vidaUtil.classList.remove('d-none')
        vidaUtilHacienda.required = true
        //fechaCompra.classList.remove('d-none')
        fechaCompraHacienda.required = true
    } else {
        vidaUtilHacienda.value = 0
        vidaUtilHacienda.required = false
        vidaUtil.classList.add('d-none')
        
        fechaCompraHacienda.value = null
        fechaCompraHacienda.required = false
        //fechaCompra.classList.add('d-none')
    }
}


function MostrarCapital() {
    var fechaCompraHacienda = vista.querySelector("#fechaCompraHacienda")
    
    fechaCompraHacienda.min = null
    fechaCompraHacienda.max = datosEmpresa.inicioEjercicio
    ocultarMediosPago()
}

function MostrarCompra() {
    var fechaCompraHacienda = vista.querySelector("#fechaCompraHacienda")
    //var fechaCompra = vista.querySelector("#fechaCompra")
    
    //fechaCompra.classList.remove('d-none')
    fechaCompraHacienda.min = datosEmpresa.inicioEjercicio
    fechaCompraHacienda.max = datosEmpresa.finEjercicio
    MC_updateFechaDeCompra(datosEmpresa.inicioEjercicio)
    mostrarMediosPago()
}


function actualizarValorTotal() {
    var cantidadHacienda = vista.querySelector("#cantidadHacienda").value
    var kilogramoCabezaHacienda = vista.querySelector("#kilogramoCabezaHacienda").value
    var valorKilogramoHacienda = vista.querySelector("#valorKilogramoHacienda").value
    
    if (cantidadHacienda) {
        cantidadHacienda = parseFloat(cantidadHacienda)
    } else {
        cantidadHacienda = 0
    }
    
    if (kilogramoCabezaHacienda) {
        kilogramoCabezaHacienda = parseFloat(kilogramoCabezaHacienda)
    } else {
        kilogramoCabezaHacienda = 0
    }
    
    if (valorKilogramoHacienda) {
        valorKilogramoHacienda = parseFloat(valorKilogramoHacienda)
    } else {
        valorKilogramoHacienda = 0
    }
    
    updateTotalAPagar(cantidadHacienda * kilogramoCabezaHacienda * valorKilogramoHacienda)
}

function validateForm() {
    var radioCompra = vista.querySelector("#radioCompra");
    if (radioCompra.checked) {
        return validarPagos()
    } else {
        return true
    }
}