function AutoCompletar(selectorFiltro, nombre, api, onFilter, onSelect) {
    autocomplete(
        selectorFiltro, {
            hint: false
        }, [{
            source: (query, cb) => {
                axios
                    .get(api + query)
                    .then(function (response) {
                        cb(response.data);
                    })
                    .catch(function (error) {
                        cb([]);
                    });
            },
            displayKey: suggestion => {
                return onFilter(suggestion);
            },
            templates: {
                suggestion: function (suggestion) {
                    return onFilter(suggestion);
                },
                empty: function (data) {
                    return "No se encontraron " + nombre + " con <strong>" + data.query + "</strong>.";
                }
            }
        }]
    ).on("autocomplete:selected", function (event, suggestion, dataset) {
        onSelect(suggestion);
    });
}

function AutoCompletarOCrear(selectorFiltro, nombre, api, onFilter, onSelect) {
    autocomplete(
        selectorFiltro, {
            hint: false
        }, [{
            source: (query, cb) => {
                axios
                    .get(api + query)
                    .then(function (response) {
                        //console.log(response.data);
                        cb(response.data);
                    })
                    .catch(function (error) {
                        cb([]);
                    });
            },
            displayKey: suggestion => {
                return onFilter(suggestion);
            },
            templates: {
                suggestion: function (suggestion) {
                    return onFilter(suggestion);
                },
                empty: function (data) {
                    return onFilter({
                        nombre: data.query 
                    });
                }
            }
        }]
    ).on("autocomplete:selected", function (event, suggestion, dataset) {
        onSelect(suggestion);
    });
}