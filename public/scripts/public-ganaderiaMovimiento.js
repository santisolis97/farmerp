var movimientos = document.querySelectorAll("#tabla-movimientos tbody tr");
var vista;
var haciendaId
var tipoHacienda;
var tipoHaciendaid;
var categoriaOrigen;
var categoriaDestino;
var agregar = document.querySelector("#agregar");


if (agregar) {
    
    agregar.addEventListener('click', function () {
        vista = document.querySelector("#agregarModal");
        myFunction(path.slice(22))
    })    
}

movimientos.forEach(function (row) {
    /* var ver = row.querySelector("#ver");
    ver.addEventListener("click", function () {
        var gastoDirecto = getElement(row);
        vista = document.querySelector("#verModal");
        setMeses()

   }) */

    var editar = row.querySelector("#editar");
    editar.addEventListener("click", function () {
        var movimiento = getElement(row);
        vista = document.querySelector("#editarModal");
        vista.querySelector("form").setAttribute("action", "/ganaderiaMovimientos/edit/" + movimiento.movimientoId);
        
        axios.get('/tiposHacienda/' + movimiento.TipoHacienda.tipoHaciendaid).then(res => {
            tipoHacienda = res.data.tipoHacienda
            
        })
        axios.get('/categoriasHacienda/api/tipo/' + movimiento.TipoHacienda.tipoHaciendaId).then(res => {
            var categorias = res.data.categorias
            var destino = vista.querySelector('#categoriaHaciendaDestino')
            destino.innerHTML = ''
    
            categorias.forEach(categ => {
                $(destino).append('<option value="'+ categ.categoriaHaciendaId +'">'+ categ.nombre +'</option>')
            })
            vista.querySelector("#categoriaHaciendaDestino").value = movimiento.categoriaHaciendaDestinoId;
        })
    
        axios.get('/categoriasHacienda/' + movimiento.categoriaHaciendaOrigenId).then(res => {
            var categoria = res.data.categoria
            categoriaOrigen=categoria
            var origen = vista.querySelector('#categoriaHaciendaOrigen')
            origen.innerHTML = ''
    
            categoria.forEach(cate => {
                $(origen).append('<option value="'+ cate.categoriaHaciendaId +'">'+ cate.nombre +'</option>')
            })
            vista.querySelector("#categoriaHaciendaOrigen").value = movimiento.categoriaHaciendaOrigenId;
        })
        
        vista.querySelector("#movimientoSalida").value = movimiento.salida;
        vista.querySelector("#movimientoPesoSalida").value = movimiento.pesoSalida;
        vista.querySelector("#movimientoEntrada").value = movimiento.entrada;
        vista.querySelector("#movimientoPesoEntrada").value = movimiento.pesoEntrada;
        vista.querySelector("#mesmovimiento").value = movimiento.mesMovimiento;
       
    })


    var eliminar = row.querySelector("#eliminar");
    if (eliminar) {
        eliminar.addEventListener("click", function () {
            var movimiento = getElement(row);
            vista = document.querySelector("#eliminarModal");
            vista.querySelector("form").setAttribute("action","/ganaderiaMovimientos/delete/" + movimiento.movimientoId);
        });
    }
});


function myFunction (haciendaId){
    if (haciendaId ===""){
        haciendaId=1
    }
    axios.get('/haciendas/' + haciendaId).then(res => {
        var hacienda = res.data.hacienda
        updateCategoriasList(hacienda[0].tipoHaciendaId,hacienda[0].categoriaHaciendaId)
    })
}


function getElement(row) {
    var element = JSON.parse(row.attributes["data"].value);
    return element;
}

function updateCategoriasList(tipoHaciendaId,categoriaId){
    tipoHaciendaid=tipoHaciendaId

    axios.get('/tiposHacienda/' + tipoHaciendaid).then(res => {
        tipoHacienda = res.data.tipoHacienda
        
    })
    axios.get('/categoriasHacienda/api/tipo/' + tipoHaciendaId).then(res => {
        var categorias = res.data.categorias
        var destino = vista.querySelector('#categoriaHaciendaDestino')
        destino.innerHTML = ''

        categorias.forEach(categ => {
            $(destino).append('<option value="'+ categ.categoriaHaciendaId +'">'+ categ.nombre +'</option>')
        })
    })

    axios.get('/categoriasHacienda/' + categoriaId).then(res => {
        var categoria = res.data.categoria
        categoriaOrigen=categoria
        var origen = vista.querySelector('#categoriaHaciendaOrigen')
        origen.innerHTML = ''

        categoria.forEach(cate => {
            $(origen).append('<option value="'+ cate.categoriaHaciendaId +'">'+ cate.nombre +'</option>')
        })
    })
}

function updateEntrada(){
    var movimientoSalida = vista.querySelector("#movimientoSalida").value
   
    var movimientoEntrada = vista.querySelector("#movimientoEntrada")

    movimientoEntrada.value = movimientoSalida - (movimientoSalida * (tipoHacienda[0].mortandad / 100)).toFixed(0)
}

