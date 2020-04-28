document.addEventListener('DOMContentLoaded',
    function () {
        var fecha = datosEmpresa.finEjercicio

        let importeTotalActivos = 0
        let importeTotalActivosCorrientes = 0
        let importeTotalActivosNoCorrientes = 0

        let importeTotalPasivosCorrientes = 0
        let importeTotalPasivos = 0
        let importeTotalPatrimonioNeto = 0

        axios.get('/contable/apiDisponibilidades/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
            let disponibilidades = res.data.disponibilidades

            importeTotalActivosCorrientes += parseFloat(disponibilidades)
            importeTotalActivos += parseFloat(disponibilidades)
            importeTotalPatrimonioNeto += parseFloat(disponibilidades)

            axios.get('/contable/apiCreditos/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                let creditos = res.data

                creditos.forEach(credito => {
                    importeTotalActivosCorrientes.innerHTML += credito.saldo
                    importeTotalActivos += credito.saldo
                    importeTotalPatrimonioNeto += credito.saldo
                });

                axios.get('/contable/apiRetiroSocios/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                    let retiros = res.data

                    retiros.forEach(retiro => {
                        importeTotalActivosCorrientes -= retiro.saldo
                        importeTotalActivos -= retiro.saldo
                        importeTotalPatrimonioNeto -= retiro.saldo
                    });

                    axios.get('/contable/apiInsumos/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                        let insumos = res.data

                        insumos.forEach(insumo => {
                            importeTotalActivosCorrientes += insumo.valorMercado
                            importeTotalActivos += insumo.valorMercado
                            importeTotalPatrimonioNeto += insumo.valorMercado
                        });

                        axios.get('/contable/apiPraderas/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                            let valorTotalAmortizacion = res.data.valorTotalAmortizacion
                            let valorTotal = res.data.valorTotal

                            importeTotalActivosCorrientes += valorTotalAmortizacion
                            importeTotalActivos += valorTotalAmortizacion
                            importeTotalPatrimonioNeto += valorTotalAmortizacion

                            importeTotalActivosNoCorrientes += valorTotal
                            importeTotalActivos += valorTotal
                            importeTotalPatrimonioNeto += valorTotal

                            axios.get('/contable/apiHaciendaCambio/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                                let valorTotalHaciendaCambio = res.data.totalHaciendaCambio

                                importeTotalActivosCorrientes += valorTotalHaciendaCambio
                                importeTotalActivos += valorTotalHaciendaCambio
                                importeTotalPatrimonioNeto += valorTotalHaciendaCambio

                                axios.get('/contable/apiStocks/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                                    let stocks = res.data

                                    stocks.forEach(stock => {
                                        importeTotalActivosCorrientes += stock.valorMercado
                                        importeTotalActivos += stock.valorMercado
                                        importeTotalPatrimonioNeto += stock.valorMercado
                                    });

                                    axios.get('/contable/apiHaciendaUso/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                                        let valorTotalHaciendaUso = res.data.totalHaciendaUso

                                        importeTotalActivosNoCorrientes += valorTotalHaciendaUso
                                        importeTotalActivos += valorTotalHaciendaUso
                                        importeTotalPatrimonioNeto += valorTotalHaciendaUso

                                        axios.get('/contable/apiInfraestructuras/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                                            let valorTotal = res.data.valorTotal

                                            importeTotalActivosNoCorrientes += valorTotal
                                            importeTotalActivos += valorTotal
                                            importeTotalPatrimonioNeto += valorTotal

                                            axios.get('/contable/apiAdministracions/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                                                let valorTotal = res.data.valorTotal

                                                importeTotalActivosNoCorrientes += valorTotal
                                                importeTotalActivos += valorTotal
                                                importeTotalPatrimonioNeto += valorTotal

                                                axios.get('/contable/apiEquipos/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                                                    let valorTotal = res.data.valorTotal

                                                    importeTotalActivosNoCorrientes += valorTotal
                                                    importeTotalActivos += valorTotal
                                                    importeTotalPatrimonioNeto += valorTotal

                                                    axios.get('/contable/apiRodados/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                                                        let valorTotal = res.data.valorTotal

                                                        importeTotalActivosNoCorrientes += valorTotal
                                                        importeTotalActivos += valorTotal
                                                        importeTotalPatrimonioNeto += valorTotal

                                                        axios.get('/contable/apiTractores/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                                                            let valorTotal = res.data.valorTotal

                                                            importeTotalActivosNoCorrientes += valorTotal
                                                            importeTotalActivos += valorTotal
                                                            importeTotalPatrimonioNeto += valorTotal

                                                            axios.get('/contable/apiImplementos/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                                                                let valorTotal = res.data.valorTotal

                                                                importeTotalActivosNoCorrientes += valorTotal
                                                                importeTotalActivos += valorTotal
                                                                importeTotalPatrimonioNeto += valorTotal

                                                                axios.get('/contable/apiAutopropulsados/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                                                                    let valorTotal = res.data.valorTotal

                                                                    importeTotalActivosNoCorrientes += valorTotal
                                                                    importeTotalActivos += valorTotal
                                                                    importeTotalPatrimonioNeto += valorTotal

                                                                    axios.get('/contable/apiLotes/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                                                                        let valorTotal = res.data.valorTotal

                                                                        importeTotalActivosNoCorrientes += valorTotal
                                                                        importeTotalActivos += valorTotal
                                                                        importeTotalPatrimonioNeto += valorTotal

                                                                        /* Pasivos */
                                                                        axios.get('/contable/apiDeudasComerciales/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                                                                            let deudas = res.data

                                                                            deudas.forEach(deuda => {
                                                                                importeTotalPasivosCorrientes += deuda.saldo
                                                                                importeTotalPasivos += deuda.saldo
                                                                                importeTotalPatrimonioNeto -= deuda.saldo
                                                                            });

                                                                            axios.get('/contable/apiDeudasFinancieras/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                                                                                let deudas = res.data

                                                                                deudas.forEach(deuda => {
                                                                                    importeTotalPasivosCorrientes += deuda.saldo
                                                                                    importeTotalPasivos += deuda.saldo
                                                                                    importeTotalPatrimonioNeto -= deuda.saldo
                                                                                });

                                                                                axios.get('/contable/apiDeudasFiscales/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                                                                                    let deudas = res.data

                                                                                    deudas.forEach(deuda => {
                                                                                        importeTotalPasivosCorrientes += deuda.saldo
                                                                                        importeTotalPasivos += deuda.saldo
                                                                                        importeTotalPatrimonioNeto -= deuda.saldo
                                                                                    });

                                                                                    axios.get('/contable/apiDeudasSociales/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                                                                                        let deudas = res.data

                                                                                        deudas.forEach(deuda => {
                                                                                            importeTotalPasivosCorrientes += deuda.saldo
                                                                                            importeTotalPasivos += deuda.saldo
                                                                                            importeTotalPatrimonioNeto -= deuda.saldo
                                                                                        });

                                                                                        axios.get('/contable/apiDeudasOtras/' + fecha + '/' + datosEmpresa.empresaId).then(res => {
                                                                                            let deudas = res.data

                                                                                            deudas.forEach(deuda => {
                                                                                                importeTotalPasivosCorrientes += deuda.saldo
                                                                                                importeTotalPasivos += deuda.saldo
                                                                                                importeTotalPatrimonioNeto -= deuda.saldo
                                                                                            });

                                                                                            /* Asigno valores y Calculo los Indices */
                                                                                            document.querySelectorAll(".importeTotalActivosCorrientes").forEach(tag => {
                                                                                                tag.innerHTML = '$ ' + importeFormat(importeTotalActivosCorrientes)
                                                                                            })

                                                                                            document.querySelectorAll(".importeTotalActivosNoCorrientes").forEach(tag => {
                                                                                                tag.innerHTML = '$ ' + importeFormat(importeTotalActivosNoCorrientes)
                                                                                            })

                                                                                            document.querySelectorAll(".importeTotalActivos").forEach(tag => {
                                                                                                tag.innerHTML = '$ ' + importeFormat(importeTotalActivos)
                                                                                            })

                                                                                            document.querySelectorAll(".importeTotalPasivosCorrientes").forEach(tag => {
                                                                                                tag.innerHTML = '$ ' + importeFormat(importeTotalPasivosCorrientes)
                                                                                            })

                                                                                            document.querySelectorAll(".importeTotalPasivos").forEach(tag => {
                                                                                                tag.innerHTML = '$ ' + importeFormat(importeTotalPasivos)
                                                                                            })

                                                                                            document.querySelectorAll(".importeTotalPatrimonioNeto").forEach(tag => {
                                                                                                tag.innerHTML = '$ ' + importeFormat(importeTotalPatrimonioNeto)
                                                                                            })

                                                                                            let razonCorriente = importeTotalActivosCorrientes / importeTotalPasivosCorrientes
                                                                                            document.querySelector("#razonCorriente").innerHTML = importeFormat(razonCorriente)

                                                                                            let endeudamiento = importeTotalPasivos / importeTotalActivos
                                                                                            document.querySelector("#endeudamiento").innerHTML = importeFormat(endeudamiento)

                                                                                            let inmobilizacion = importeTotalPatrimonioNeto / importeTotalActivosNoCorrientes
                                                                                            document.querySelector("#inmobilizacion").innerHTML = importeFormat(inmobilizacion)

                                                                                            let solvencia = importeTotalActivos / importeTotalPasivos
                                                                                            document.querySelector("#solvencia").innerHTML = importeFormat(solvencia)

                                                                                            let financiamientoPropio = importeTotalPatrimonioNeto / importeTotalActivos
                                                                                            document.querySelector("#financiamientoPropio").innerHTML = importeFormat(financiamientoPropio)

                                                                                            document.querySelector("#cargando").classList.add("d-none")
                                                                                            document.querySelector("#divIF").classList.remove("d-none")
                                                                                        })
                                                                                    })
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    }
)


function printReport() {
    const filename = 'Indices Financieros.pdf';
    let height = document.querySelector('#divIF').clientHeight
    let width = document.querySelector('#divIF').clientWidth

    let cuerpo = document.querySelector('#divIF')

    let pdf = new jsPDF('p', 'mm', 'a4');

    html2canvas(cuerpo).then(canvas => {
        pdf.addImage(canvas.toDataURL('image/png', 1), 'PNG', 15, 20, 180, (width * 180 / height));
        pdf.save(filename);
    });
}