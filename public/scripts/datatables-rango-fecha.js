function InitRangoFecha(idColumnaFechaInicio, idColumnaFechaFin, fechaCompleta) {
    jQuery(function ($) {
        const dataSearch = $("#Date_search");
        if (dataSearch) {
            dataSearch.daterangepicker({
                autoUpdateInput: false,
                locale: {
                    "cancelLabel": "Limpiar",
                    "applyLabel": "Aplicar",
                    "customRangeLabel": "Rango personalizado",

                },
                ranges: {
                    'Hoy': [moment(), moment()],
                    'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
                    'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
                    'Este Mes': [moment().startOf('month'), moment().endOf('month')],
                    'El Mes Pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            });

            dataSearch.on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('YYYY-MM-DD') + ' hasta ' + picker.endDate.format('YYYY-MM-DD'));
                MyDataTable.draw();
            });

            dataSearch.on('cancel.daterangepicker', function (ev, picker) {
                $(this).val('');
                MyDataTable.draw();
            });
            $("#clear").click(function () {
                dataSearch.val('');
                MyDataTable.draw();
            });
            // Date range script - END of the script
            $.fn.dataTableExt.afnFiltering.push(
                function (oSettings, aData, iDataIndex) {
                    const grab_daterange = dataSearch.val();
                    const give_results_daterange = grab_daterange.split(" hasta ");
                    const filterstart = give_results_daterange[0];
                    const filterend = give_results_daterange[1];
                    let tabledatestart = aData[idColumnaFechaInicio];
                    let tabledateend = aData[idColumnaFechaFin];
                    if (fechaCompleta) {
                        tabledatestart = tabledatestart.split(' - ')[0];
                        tabledateend = tabledateend.split(' - ')[0];
                    }

                    const startDataBetweenRange = moment(tabledatestart).isSameOrAfter(filterstart) && moment(tabledatestart).isSameOrBefore(filterend);
                    const endDataBetweenRange = moment(tabledateend).isSameOrAfter(filterstart) && moment(tabledateend).isSameOrBefore(filterend);
                    if (!filterstart && !filterend) {
                        return true;
                    } else if (filterend === "") {
                        return startDataBetweenRange;
                    } else if (filterstart === "") {
                        return moment(filterstart).isSame(tabledatestart) || moment(filterstart).isAfter(tabledatestart);
                    } else {
                        return startDataBetweenRange || endDataBetweenRange;
                    }
                }

            );
        }
    })
}