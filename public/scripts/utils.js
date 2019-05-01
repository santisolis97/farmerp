function getClasesPorSemana(clase) {
    let vecesSemana = 0;
    vecesSemana += clase.lunes ? 1 : 0;
    vecesSemana += clase.martes ? 1 : 0;
    vecesSemana += clase.miercoles ? 1 : 0;
    vecesSemana += clase.jueves ? 1 : 0;
    vecesSemana += clase.viernes ? 1 : 0;
    vecesSemana += clase.sabado ? 1 : 0;
    return vecesSemana;
}

function getPrecioClase(clase, vecesSemana) {
    if (typeof vecesSemana == 'undefined') vecesSemana = getClasesPorSemana(clase);
    switch (vecesSemana) {
        case 0:
            return 0;
        case 1:
            return clase.precio1dias;
        case 2:
            return clase.precio2dias;
        case 3:
            return clase.precio3dias;
        case 4:
            return clase.precio4dias;
        case 5:
            return clase.precio5dias;
            // no hay precio para 6 dias >.>
        case 6:
            return clase.precio5dias;
    }
    return 'ERROR';
}

function getNombreClase(clase) {
    let nombreClase = clase.Actividad.nombre + ', Horario: ' + clase.horario + ', Dias: ';
    nombreClase += clase.lunes ? 'Lunes ' : '';
    nombreClase += clase.martes ? 'Martes ' : '';
    nombreClase += clase.miercoles ? 'Miercoles ' : '';
    nombreClase += clase.jueves ? 'Jueves ' : '';
    nombreClase += clase.viernes ? 'Viernes ' : '';
    nombreClase += clase.sabado ? 'Sabado ' : '';
    return nombreClase;
}

function getUID() {
    return Date.now() + "-" + Math.round(Math.random() * 1000);
}