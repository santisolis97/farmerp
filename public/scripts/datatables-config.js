var MyDataTable;
var titulo = document.querySelector("#titulo");
var filtro = false;
var rangoFecha = "";

function InitDataTable(tableId) {
    jQuery(function ($) {
        $(document).ready(function () {

            if (titulo) {
                MyDataTable = $(tableId).DataTable({
                    "order": [
                        [0, 'asc']
                    ],
                    "language": {
                        "decimal": ",",
                        "emptyTable": "No hay datos disponibles",
                        "info": "Mostrando <strong>_START_</strong> a <strong>_END_</strong> de <strong>_TOTAL_</strong> entradas",
                        "infoEmpty": "Mostrando <strong>0</strong> a <strong>0</strong> de <strong>0</strong> entradas",
                        "infoFiltered": "(filtrado de <strong>_MAX_</strong> entradas totales)",
                        "infoPostFix": "",
                        "thousands": ".",
                        "lengthMenu": "Mostrar _MENU_ entradas",
                        "loadingRecords": "Cargando...",
                        "processing": "Procesando...",
                        "search": "Buscar:",
                        "zeroRecords": "No hay coincidencias",
                        "paginate": {
                            "first": "Primero",
                            "last": "Último",
                            "next": "Siguiente",
                            "previous": "Anterior"
                        },
                        "aria": {
                            "sortAscending": ": activar para ordenar la columna ascendente",
                            "sortDescending": ": activar para ordenar la columna descendente"
                        }
                    },
                    buttons: [{
                            extend: 'excel',
                            text: '<i class="fa fa-table"></i> Exportar a Excel',
                            className: 'btn btn-primary',
                            titleAttr: 'Exportar a Excel',
                            title: 'FarmERP - ' + document.getElementById("titulo").getAttribute("data-value"),
                            messageTop: function () {
                                if (document.querySelector("#Date_search")) {
                                    rangoFecha = document.querySelector("#Date_search").value
                                }

                                if (filtro == "" && rangoFecha == "") {
                                    return false
                                } else if (filtro != "" && rangoFecha == "") {
                                    return 'Filtrado por: ' + filtro;
                                } else if (filtro == "" && rangoFecha != "") {
                                    return 'Filtrado por Rango de Fecha: ' + rangoFecha;
                                } else {
                                    return 'Filtrado por: ' + filtro + ' , Rango de Fecha: ' + rangoFecha;
                                }
                            },
                            messageBottom: 'Elaborado el '+ (new Date()).toLocaleDateString() + ', a las ' + (new Date()).toLocaleTimeString(),
                            exportOptions: {
                                columns: ':not(.not-export-col)',
                                modifier: {
                                    page: 'current',

                                }
                            }
                        }
                    ]

                });

                $(tableId).on('search.dt', function () {
                    filtro = $('.dataTables_filter input').val();
                    //console.log(filtro); // <-- the value
                });



                MyDataTable.buttons().container().appendTo('#tableButtons');
            } else {

                MyDataTable = $(tableId).DataTable({
                    "order": [
                        [0, 'desc']
                    ],
                    "language": {
                        "decimal": ",",
                        "emptyTable": "No hay datos disponibles",
                        "info": "Mostrando <strong>_START_</strong> a <strong>_END_</strong> de <strong>_TOTAL_</strong> entradas",
                        "infoEmpty": "Mostrando <strong>0</strong> a <strong>0</strong> de <strong>0</strong> entradas",
                        "infoFiltered": "(filtrado de <strong>_MAX_</strong> entradas totales)",
                        "infoPostFix": "",
                        "thousands": ".",
                        "lengthMenu": "Mostrar _MENU_ entradas",
                        "loadingRecords": "Cargando...",
                        "processing": "Procesando...",
                        "search": "Buscar:",
                        "zeroRecords": "No hay coincidencias",
                        "paginate": {
                            "first": "Primero",
                            "last": "Último",
                            "next": "Siguiente",
                            "previous": "Anterior"
                        },
                        "aria": {
                            "sortAscending": ": activar para ordenar la columna ascendente",
                            "sortDescending": ": activar para ordenar la columna descendente"
                        },
                    },
                    buttons: []

                });

                MyDataTable.buttons().container().appendTo('#tableButtons');
            }

        });

    })
}