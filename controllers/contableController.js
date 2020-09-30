const Saldos = require("./../utils/saldos")
const models = require("./../models");
const sendReport = require("../utils/sendReport");
const Op = models.Sequelize.Op
const sequelize = models.sequelize
const AgriculturaGastoDirecto = models.AgriculturaGastoDirecto
const Concepto = models.Concepto
const Credito = models.Credito
const Cultivo = models.Cultivo
const RetiroSocio = models.RetiroSocio
const ParametrosAgricultura = models.parametrosAgricultura
const Insumo = models.Insumo
const Pradera = models.Pradera
const Stock = models.Stock
const TipoHacienda = models.TipoHacienda
const Hacienda = models.Hacienda
const Lote = models.Lote
const Infraestructura = models.Infraestructura
const Administracion = models.Administracion
const Equipo = models.Equipo
const Rodado = models.Rodado
const Tractor = models.Tractor
const Implemento = models.Implemento
const Autopropulsado = models.Autopropulsado
const DeudaComercial = models.DeudaComercial
const DeudaFinanciera = models.DeudaFinanciera
const DeudaFiscal = models.DeudaFiscal
const DeudaSocial = models.DeudaSocial
const DeudaOtra = models.DeudaOtra
const MovimientoCompra = models.MovimientoCompra;
const MovimientoVenta = models.MovimientoVenta;


var contableController = {};

/* Parametros Globales Agricultura */
contableController.showparametrosGlobales = function (req, res) {
    ParametrosAgricultura.findOne({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(parametroagricultura => {
        res.render("contable/parametrosGlobales/parametrosGlobales", {
            parametroagricultura
        })
    })
};

/*Edit Parametros Globales Agricultura */
contableController.updateparametroAgricultura = function (req, res) {
    var reqparamAgricultura = req.body.parametroagricultura
    ParametrosAgricultura.update(
        reqparamAgricultura, {
                where: {
                    Id: req.params.id
                }
            }).then(() => {
            req.flash("success_msg", "Se actualizó Parámetros Globales de Agricultura correctamente");
            res.redirect("/contable/parametrosGlobales");
        })
        .catch(err => {
            req.flash("error_msg", "Error al actualizar Parámetros Globales de Agricultura");
            res.redirect("/contable/parametrosGlobales");
        });
}

/* Reporte Ingresos Brutos Resumido */
contableController.rptIngresosBrutosResumido = async function (req, res) {
    let agriculturaIVAVenta = 0
    let agriculturaAlicuota = 0
    let movMeses = []
    let posicionAcumuladaAnterior = 0

    await ParametrosAgricultura.findOne({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(async parametroagricultura => {
        agriculturaIVAVenta = parametroagricultura.iva
        agriculturaAlicuota = parametroagricultura.alicuota
    })

    for (let i = 1; i < 13; i++) {
        let iibbMes = 0

        let mov = {
            mes: res.locals.empresa.meses[i-1],
            totalCompras: 0,
            iva10Compra: 0,
            iva21Compra: 0,
            iva27Compra: 0,
            totalIvaCompra: 0,

            totalVentas: 0,
            iva10Venta: 0,
            iva21Venta: 0,
            totalIvaVenta: 0,
            
            posicion: 0,
            posicionAcumulada: 0,

            iibb: 0
        }
        
        /* Obtengo compras - Actividad Agricultura */
        await AgriculturaGastoDirecto.findAll({
            where: {
                empresaId: req.params.id,
            },
            include: [
                {
                    model: Cultivo
                },
                {
                    model: Concepto,
                    where: {
                        mescompra: i
                    }
                },
            ]
        }).then(async gastos => {
            let totalCompras = 0
            let iva10Compra = 0
            let iva21Compra = 0
            let iva27Compra = 0
            let totalIvaCompra = 0
            gastos.forEach(gasto => {
                let totGasto = gasto.Concepto.precio * gasto.cantRequerida * gasto.Cultivo.superficieAsignada
                let ivaGasto =  totGasto * gasto.Concepto.porcIVA / 100 
                
                totalCompras += totGasto
                
                if(gasto.Concepto.porcIVA == 10.5){
                    iva10Compra += ivaGasto
                } else if(gasto.Concepto.porcIVA == 21){
                    iva21Compra += ivaGasto
                } else if(gasto.Concepto.porcIVA == 27){
                    iva27Compra += ivaGasto
                }

                totalIvaCompra += ivaGasto
            })

            mov.totalCompras = totalCompras
            mov.iva10Compra = iva10Compra
            mov.iva21Compra = iva21Compra
            mov.iva27Compra = iva27Compra
            mov.totalIvaCompra = totalIvaCompra
        }).catch(err => {
            console.log(err)
        })

        /* Obtengo ventas - Actividad Agricultura */
        await Cultivo.findAll({
            where: {
                empresaId: req.params.id,
                mesventa: i
            }
        }).then(async cultivos => {
            let totalVentas =  0
            let iva10Venta = 0
            let iva21Venta = 0
            let totalIvaVenta = 0

            cultivos.forEach(cultivo => {
                let totVenta = cultivo.superficieAsignada * cultivo.rendimiento * (cultivo.porcVenta/100) * (cultivo.precioPizarra * (1 - cultivo.porcGastosComer/100)) 
                let ivaVenta = totVenta * agriculturaIVAVenta / 100

                totalVentas += totVenta
                
                if(agriculturaIVAVenta == 10.5){
                    iva10Venta += ivaVenta
                } else if(agriculturaIVAVenta == 21){
                    iva21Venta += ivaVenta
                }

                totalIvaVenta += ivaVenta
            })

            mov.totalVentas = totalVentas
            mov.iva10Venta = iva10Venta
            mov.iva21Venta = iva21Venta
            mov.totalIvaVenta = totalIvaVenta

            
            /* Calculo Ingresos Brutos */
            iibbMes = mov.totalVentas * agriculturaAlicuota / 100
        }).catch(err => {
            console.log(err)
        })

        /* Calculo Posición y Posición Acumulada */
        let posicion = mov.totalIvaCompra - mov.totalIvaVenta
        mov.posicion = posicion

        if(i == 1){
            mov.posicionAcumulada = posicion
        } else {
            if(posicionAcumuladaAnterior > 0){
                mov.posicionAcumulada = posicion + posicionAcumuladaAnterior
            } else {
                mov.posicionAcumulada = posicion
            } 
        }
        
        posicionAcumuladaAnterior = mov.posicionAcumulada

        mov.iibb = iibbMes

        await movMeses.push(mov)
    }
 
    let empresa = res.locals.empresa
    let datos = {
        empresa,
        movMeses
    }
    sendReport("ingresosBrutosResumido", datos, res, "landscape")
};

/* API Caja */
contableController.getCaja = async (req, res) => {
    var caja = await Saldos.saldoCaja(req.params.empresaId, req.params.fecha)
    res.send(caja)
}

/* API Banco */
contableController.getBanco = async (req, res) => {
    var banco = await Saldos.saldoBanco(req.params.empresaId, req.params.fecha)
    res.send(banco)
}

/* API Inversiones Transitorias */
contableController.getInversiones = async (req, res) => {
    var inversiones = await Saldos.saldoInversion(req.params.empresaId, req.params.fecha)
    res.send(inversiones)
}

/* API Disponibilidades */
contableController.getDisponibilidades = async (req, res) => {
    var disponibilidades = 0
    var caja = await Saldos.saldoCaja(req.params.empresaId, req.params.fecha)
    var banco = await Saldos.saldoBanco(req.params.empresaId, req.params.fecha)
    var inversiones = await Saldos.saldoInversion(req.params.empresaId, req.params.fecha)

    disponibilidades = parseFloat(caja.saldo) + parseFloat(banco.saldo) + parseFloat(inversiones.saldo)

    res.send({
        disponibilidades
    })
}


/* API Créditos */
contableController.getCreditos = (req, res) => {
    var fecha = new Date(req.params.fecha)
    var saldos = []

    Credito.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(creditos => {
        if (creditos.length > 0) {
            for (let i = 0; i < creditos.length; i++) {
                const credito = creditos[i];

                credito.dataValues.saldo = parseFloat(credito.monto)
                MovimientoVenta.findAll({
                    where: {
                        concepto: 'Credito',
                        conceptoId: credito.creditoId
                    }
                }).then(movimientos => {
                    movimientos.forEach(mov => {
                        if (new Date(mov.fecha) <= fecha) {
                            credito.dataValues.saldo -= parseFloat(mov.monto)
                        }
                    });
                    saldos.push(credito)
                }).then(() => {
                    if (i == (creditos.length - 1)) {
                        res.send(saldos)
                    }
                })
            }
        } else {
            res.send(saldos)
        }
    })
}

/* API Retiro Socios */
contableController.getRetiroSocios = (req, res) => {
    var fecha = new Date(req.params.fecha)
    var saldos = []

    RetiroSocio.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(retiros => {
        if (retiros.length > 0) {
            for (let i = 0; i < retiros.length; i++) {
                const retiro = retiros[i];

                retiro.dataValues.saldo = parseFloat(retiro.monto)
                MovimientoCompra.findAll({
                    where: {
                        concepto: 'RetiroSocio',
                        conceptoId: retiro.retiroSocioId
                    }
                }).then(movimientos => {
                    movimientos.forEach(mov => {
                        if (new Date(mov.fecha) <= fecha) {
                            retiro.dataValues.saldo -= parseFloat(mov.monto)
                        }
                    });
                    saldos.push(retiro)
                }).then(() => {
                    if (i == (retiros.length - 1)) {
                        res.send(saldos)
                    }
                })
            }
        } else {
            res.send(saldos)
        }
    })
}

/* API Insumos Agrícola - Ganaderos */
contableController.getInsumos = (req, res) => {
    Insumo.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(insumos => {
        insumos.map(insumo => {
            var valorMercado = insumo.cantidad * insumo.valorUnitario;
            insumo.dataValues.valorMercado = valorMercado;
        });

        res.send(insumos);
    })
}

/* API Stock Productos */
contableController.getStocks = (req, res) => {
    Stock.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(stocks => {
        stocks.map(stock => {
            var valorMercado = stock.cantidad * stock.valorUnitario;
            stock.dataValues.valorMercado = valorMercado;
        });

        res.send(stocks);
    })
}

/* API Hacienda - Bienes de Cambio */
contableController.getHaciendaCambio = (req, res) => {
    var fecha = new Date(req.params.fecha)
    var haciendaCambio = []
    var totalHaciendaCambio = 0

    TipoHacienda.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(tipos => {
        for (let i = 0; i < tipos.length; i++) {
            const tipo = tipos[i];

            Hacienda.findAll({
                where: {
                    tipoHaciendaId: tipo.tipoHaciendaId,
                    tipoBien: "Bien de Cambio"
                }
            }).then(haciendas => {
                var totalHacienda = 0
                haciendas.forEach(hacienda => {
                    var totalKilogramos = hacienda.cantidad * hacienda.kilogramoCabeza;
                    var valorMercado = totalKilogramos * hacienda.valorKilogramo;

                    hacienda.dataValues.totalKilogramos = totalKilogramos;
                    hacienda.dataValues.valorMercado = valorMercado;

                    if ((!hacienda.fechaVenta || new Date(hacienda.fechaVenta) > fecha) && (!hacienda.fechaCompra || new Date(hacienda.fechaCompra) <= fecha)) {
                        if (hacienda.fechaCompra && hacienda.tipoBien == 'Bien de Uso') {
                            var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(hacienda.fechaCompra);
                            antiguedad = Math.trunc(antiguedad / (1000 * 60 * 60 * 24 * 365))
                            var amortizacion = valorMercado / hacienda.vidaUtil
                            var amortizacionAcumulada;
                            var valorANuevo;

                            if (amortizacion * antiguedad >= hacienda.dataValues.valorMercado) {
                                amortizacionAcumulada = hacienda.dataValues.valorMercado
                            } else {
                                amortizacionAcumulada = amortizacion * antiguedad
                            }

                            if (hacienda.dataValues.valorMercado - amortizacionAcumulada <= 0) {
                                valorANuevo = (0)
                            } else {
                                valorANuevo = hacienda.dataValues.valorMercado - amortizacionAcumulada
                            }

                            hacienda.dataValues.antiguedad = antiguedad;
                            hacienda.dataValues.amortizacion = amortizacion;
                            hacienda.dataValues.amortizacionAcumulada = amortizacionAcumulada;
                            hacienda.dataValues.valorANuevo = valorANuevo;
                        } else {
                            hacienda.dataValues.antiguedad = 0;
                            hacienda.dataValues.amortizacion = 0;
                            hacienda.dataValues.amortizacionAcumulada = 0;
                            hacienda.dataValues.valorANuevo = valorMercado;
                        }
                    }

                    totalHacienda += hacienda.dataValues.valorANuevo
                })
                if (totalHacienda) {
                    totalHaciendaCambio += totalHacienda
                    haciendaCambio.push({
                        tipoHacienda: tipo.nombre,
                        valorTotal: totalHacienda
                    })
                }
            }).then(() => {
                if (i == tipos.length - 1) {
                    res.send({
                        totalHaciendaCambio,
                        haciendaCambio
                    })
                }
            })
        }

        if (tipos.length == 0) {
            res.send({
                totalHaciendaCambio,
                haciendaCambio
            })
        }
    })
}

/* API Hacienda - Bienes de Uso */
contableController.getHaciendaUso = (req, res) => {
    var fecha = new Date(req.params.fecha)
    var haciendaUso = []
    var totalHaciendaUso = 0

    TipoHacienda.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(tipos => {
        for (let i = 0; i < tipos.length; i++) {
            const tipo = tipos[i];

            Hacienda.findAll({
                where: {
                    tipoHaciendaId: tipo.tipoHaciendaId,
                    tipoBien: "Bien de Uso"
                }
            }).then(haciendas => {
                var totalHacienda = 0
                haciendas.forEach(hacienda => {
                    var totalKilogramos = hacienda.cantidad * hacienda.kilogramoCabeza;
                    var valorMercado = totalKilogramos * hacienda.valorKilogramo;

                    hacienda.dataValues.totalKilogramos = totalKilogramos;
                    hacienda.dataValues.valorMercado = valorMercado;

                    if ((!hacienda.fechaVenta || new Date(hacienda.fechaVenta) > fecha) && (!hacienda.fechaCompra || new Date(hacienda.fechaCompra) <= fecha)) {
                        if (hacienda.fechaCompra && hacienda.tipoBien == 'Bien de Uso') {
                            var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(hacienda.fechaCompra);
                            antiguedad = Math.trunc(antiguedad / (1000 * 60 * 60 * 24 * 365))
                            var amortizacion = valorMercado / hacienda.vidaUtil
                            var amortizacionAcumulada;
                            var valorANuevo;

                            if (amortizacion * antiguedad >= hacienda.dataValues.valorMercado) {
                                amortizacionAcumulada = hacienda.dataValues.valorMercado
                            } else {
                                amortizacionAcumulada = amortizacion * antiguedad
                            }

                            if (hacienda.dataValues.valorMercado - amortizacionAcumulada <= 0) {
                                valorANuevo = (0)
                            } else {
                                valorANuevo = hacienda.dataValues.valorMercado - amortizacionAcumulada
                            }

                            hacienda.dataValues.antiguedad = antiguedad;
                            hacienda.dataValues.amortizacion = amortizacion;
                            hacienda.dataValues.amortizacionAcumulada = amortizacionAcumulada;
                            hacienda.dataValues.valorANuevo = valorANuevo;
                        } else {
                            hacienda.dataValues.antiguedad = 0;
                            hacienda.dataValues.amortizacion = 0;
                            hacienda.dataValues.amortizacionAcumulada = 0;
                            hacienda.dataValues.valorANuevo = valorMercado;
                        }
                    }

                    totalHacienda += hacienda.dataValues.valorANuevo
                })
                if (totalHacienda) {
                    totalHaciendaUso += totalHacienda
                    haciendaUso.push({
                        tipoHacienda: tipo.nombre,
                        valorTotal: totalHacienda
                    })
                }
            }).then(() => {
                if (i == tipos.length - 1) {
                    res.send({
                        totalHaciendaUso,
                        haciendaUso
                    })
                }
            })
        }

        if (tipos.length == 0) {
            res.send({
                totalHaciendaUso,
                haciendaUso
            })
        }
    })
}

/* API Mejoras-Infraestructura */
contableController.getInfraestructuras = (req, res) => {
    var fecha = new Date(req.params.fecha)

    Infraestructura.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(infraestructuras => {
        var valorTotal = 0

        infraestructuras.map(infraestructura => {
            if ((!infraestructura.fechaVenta || new Date(infraestructura.fechaVenta) > fecha) && new Date(infraestructura.fechaCompra) <= fecha) {

                var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(infraestructura.fechaCompra);
                antiguedad = Math.trunc(antiguedad / (1000 * 60 * 60 * 24 * 365))
                var valorMercado = infraestructura.cantidad * infraestructura.valorUnitario;
                var valorResidualMonto = infraestructura.cantidad * infraestructura.valorUnitario * infraestructura.valorResidual / 100;
                var amortizacion = (valorMercado - valorResidualMonto) / infraestructura.vidaUtil
                var amortizacionAcumulada;
                var valorANuevo;

                if (amortizacion * antiguedad >= valorMercado) {
                    amortizacionAcumulada = valorMercado
                } else {
                    amortizacionAcumulada = amortizacion * antiguedad
                }

                if (valorMercado - amortizacionAcumulada <= 0) {
                    valorANuevo = valorMercado
                } else {
                    valorANuevo = valorMercado - amortizacionAcumulada
                }

                valorTotal += parseFloat(valorANuevo)
            }
        });

        res.send({
            valorTotal
        });
    });
}

/* API Praderas - Amortización */
contableController.getPraderas = (req, res) => {
    var fecha = new Date(req.params.fecha)

    Pradera.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(praderasTodas => {
        var valorTotalAmortizacion = 0
        var valorTotal = 0
        var praderas = []

        praderasTodas.map(pradera => {
            if (new Date(pradera.fechaImplantacion) <= fecha) {

                var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(pradera.fechaImplantacion);
                antiguedad = Math.trunc(antiguedad / (1000 * 60 * 60 * 24 * 365))
                var valorMercado = pradera.hectareas * pradera.valorHectarea;
                var valorResidualMonto = pradera.hectareas * pradera.valorHectarea * pradera.valorResidual / 100;
                var amortizacion = (valorMercado - valorResidualMonto) / pradera.vidaUtil
                var amortizacionAcumulada;
                var valorANuevo;

                if (amortizacion * antiguedad >= valorMercado) {
                    amortizacionAcumulada = valorMercado
                } else {
                    amortizacionAcumulada = amortizacion * antiguedad
                }

                if (valorMercado - amortizacionAcumulada <= 0) {
                    valorANuevo = valorMercado
                } else {
                    valorANuevo = valorMercado - amortizacionAcumulada
                }

                pradera.dataValues.amortizacionAcumulada = amortizacionAcumulada
                pradera.dataValues.valorANuevo = valorANuevo

                valorTotalAmortizacion += parseFloat(amortizacionAcumulada)
                valorTotal += parseFloat(valorANuevo)
                praderas.push(pradera)
            }
        });

        res.send({
            praderas,
            valorTotalAmortizacion,
            valorTotal
        });
    });
}

/* API Administracion */
contableController.getAdministracions = (req, res) => {
    var fecha = new Date(req.params.fecha)

    Administracion.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(administracions => {
        var valorTotal = 0

        administracions.map(administracion => {
            if ((!administracion.fechaVenta || new Date(administracion.fechaVenta) > fecha) && new Date(administracion.fechaCompra) <= fecha) {

                var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(administracion.fechaCompra);
                antiguedad = Math.trunc(antiguedad / (1000 * 60 * 60 * 24 * 365))
                var valorMercado = administracion.cantidad * administracion.valorUnitario;
                var valorResidualMonto = administracion.cantidad * administracion.valorUnitario * administracion.valorResidual / 100;
                var amortizacion = (valorMercado - valorResidualMonto) / administracion.vidaUtil
                var amortizacionAcumulada;
                var valorANuevo;

                if (amortizacion * antiguedad >= valorMercado) {
                    amortizacionAcumulada = valorMercado
                } else {
                    amortizacionAcumulada = amortizacion * antiguedad
                }

                if (valorMercado - amortizacionAcumulada <= 0) {
                    valorANuevo = valorMercado
                } else {
                    valorANuevo = valorMercado - amortizacionAcumulada
                }

                valorTotal += parseFloat(valorANuevo)
            }
        });

        res.send({
            valorTotal
        });
    });
}

/* API Equipos */
contableController.getEquipos = (req, res) => {
    var fecha = new Date(req.params.fecha)

    Equipo.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(equipos => {
        var valorTotal = 0

        equipos.map(equipo => {
            if ((!equipo.fechaVenta || new Date(equipo.fechaVenta) > fecha) && new Date(equipo.fechaCompra) <= fecha) {

                var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(equipo.fechaCompra);
                antiguedad = Math.trunc(antiguedad / (1000 * 60 * 60 * 24 * 365))
                var valorMercado = equipo.valorUnitario;
                var valorResidualMonto = equipo.valorUnitario * equipo.valorResidual / 100;
                var amortizacion = (valorMercado - valorResidualMonto) / equipo.vidaUtil
                var amortizacionAcumulada;
                var valorANuevo;

                if (amortizacion * antiguedad >= valorMercado) {
                    amortizacionAcumulada = valorMercado
                } else {
                    amortizacionAcumulada = amortizacion * antiguedad
                }

                if (valorMercado - amortizacionAcumulada <= 0) {
                    valorANuevo = valorMercado
                } else {
                    valorANuevo = valorMercado - amortizacionAcumulada
                }

                valorTotal += parseFloat(valorANuevo)
            }
        });

        res.send({
            valorTotal
        });
    });
}

/* API Rodados */
contableController.getRodados = (req, res) => {
    var fecha = new Date(req.params.fecha)

    Rodado.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(rodados => {
        var valorTotal = 0

        rodados.map(rodado => {
            if ((!rodado.fechaVenta || new Date(rodado.fechaVenta) > fecha) && new Date(rodado.fechaCompra) <= fecha) {

                var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(rodado.fechaCompra);
                antiguedad = Math.trunc(antiguedad / (1000 * 60 * 60 * 24 * 365))
                var valorMercado = rodado.cantidad * rodado.valorUnitario;
                var valorResidualMonto = rodado.cantidad * rodado.valorUnitario * rodado.valorResidual / 100;
                var amortizacion = (valorMercado - valorResidualMonto) / rodado.vidaUtil
                var amortizacionAcumulada;
                var valorANuevo;

                if (amortizacion * antiguedad >= valorMercado) {
                    amortizacionAcumulada = valorMercado
                } else {
                    amortizacionAcumulada = amortizacion * antiguedad
                }

                if (valorMercado - amortizacionAcumulada <= 0) {
                    valorANuevo = valorMercado
                } else {
                    valorANuevo = valorMercado - amortizacionAcumulada
                }

                valorTotal += parseFloat(valorANuevo)
            }
        });

        res.send({
            valorTotal
        });
    });
}

/* API Tractores */
contableController.getTractores = (req, res) => {
    var fecha = new Date(req.params.fecha)

    Tractor.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(tractores => {
        var valorTotal = 0

        tractores.map(tractor => {
            if ((!tractor.fechaVenta || new Date(tractor.fechaVenta) > fecha) && new Date(tractor.fechaCompra) <= fecha) {

                var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(tractor.fechaCompra);
                antiguedad = Math.trunc(antiguedad / (1000 * 60 * 60 * 24 * 365))
                var valorMercado = tractor.valorUnitario;
                var valorResidualMonto = tractor.valorUnitario * tractor.valorResidual / 100;
                var amortizacion = (valorMercado - valorResidualMonto) / tractor.vidaUtil
                var amortizacionAcumulada;
                var valorANuevo;

                if (amortizacion * antiguedad >= valorMercado) {
                    amortizacionAcumulada = valorMercado
                } else {
                    amortizacionAcumulada = amortizacion * antiguedad
                }

                if (valorMercado - amortizacionAcumulada <= 0) {
                    valorANuevo = valorMercado
                } else {
                    valorANuevo = valorMercado - amortizacionAcumulada
                }

                valorTotal += parseFloat(valorANuevo)
            }
        });

        res.send({
            valorTotal
        });
    });
}

/* API Implementos */
contableController.getImplementos = (req, res) => {
    var fecha = new Date(req.params.fecha)

    Implemento.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(implementos => {
        var valorTotal = 0

        implementos.map(implemento => {
            if ((!implemento.fechaVenta || new Date(implemento.fechaVenta) > fecha) && new Date(implemento.fechaCompra) <= fecha) {

                var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(implemento.fechaCompra);
                antiguedad = Math.trunc(antiguedad / (1000 * 60 * 60 * 24 * 365))
                var valorMercado = implemento.valorUnitario;
                var valorResidualMonto = implemento.valorUnitario * implemento.valorResidual / 100;
                var amortizacion = (valorMercado - valorResidualMonto) / implemento.vidaUtil
                var amortizacionAcumulada;
                var valorANuevo;

                if (amortizacion * antiguedad >= valorMercado) {
                    amortizacionAcumulada = valorMercado
                } else {
                    amortizacionAcumulada = amortizacion * antiguedad
                }

                if (valorMercado - amortizacionAcumulada <= 0) {
                    valorANuevo = valorMercado
                } else {
                    valorANuevo = valorMercado - amortizacionAcumulada
                }

                valorTotal += parseFloat(valorANuevo)
            }
        });

        res.send({
            valorTotal
        });
    });
}

/* API Autopropulsados */
contableController.getAutopropulsados = (req, res) => {
    var fecha = new Date(req.params.fecha)

    Autopropulsado.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(autopropulsados => {
        var valorTotal = 0

        autopropulsados.map(autopropulsado => {
            if ((!autopropulsado.fechaVenta || new Date(autopropulsado.fechaVenta) > fecha) && new Date(autopropulsado.fechaCompra) <= fecha) {

                var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(autopropulsado.fechaCompra);
                antiguedad = Math.trunc(antiguedad / (1000 * 60 * 60 * 24 * 365))
                var valorMercado = autopropulsado.valorUnitario;
                var valorResidualMonto = autopropulsado.valorUnitario * autopropulsado.valorResidual / 100;
                var amortizacion = (valorMercado - valorResidualMonto) / autopropulsado.vidaUtil
                var amortizacionAcumulada;
                var valorANuevo;

                if (amortizacion * antiguedad >= valorMercado) {
                    amortizacionAcumulada = valorMercado
                } else {
                    amortizacionAcumulada = amortizacion * antiguedad
                }

                if (valorMercado - amortizacionAcumulada <= 0) {
                    valorANuevo = valorMercado
                } else {
                    valorANuevo = valorMercado - amortizacionAcumulada
                }

                valorTotal += parseFloat(valorANuevo)
            }
        });

        res.send({
            valorTotal
        });
    });
}

/* API Lotes*/
contableController.getLotes = (req, res) => {
    var fecha = new Date(req.params.fecha)

    Lote.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(lotes => {
        var valorTotal = 0

        lotes.map(lote => {
            if ((!lote.fechaVenta || new Date(lote.fechaVenta) > fecha) && (!lote.fechaCompra || new Date(lote.fechaCompra) <= fecha)) {
                var valorLote = lote.superficie * lote.valorHectarea;
                valorTotal += parseFloat(valorLote)
            }
        });

        res.send({
            valorTotal
        });
    });
}

/* API Deudas Comerciales */
contableController.getDeudasComerciales = (req, res) => {
    var fecha = new Date(req.params.fecha)
    var saldos = []

    DeudaComercial.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(deudas => {
        if (deudas.length > 0) {
            for (let i = 0; i < deudas.length; i++) {
                const deuda = deudas[i];

                deuda.dataValues.saldo = parseFloat(deuda.monto)
                MovimientoCompra.findAll({
                    where: {
                        concepto: 'DeudaComercial',
                        conceptoId: deuda.deudaComercialId
                    }
                }).then(movimientos => {
                    movimientos.forEach(mov => {
                        if (new Date(mov.fecha) <= fecha) {
                            deuda.dataValues.saldo -= parseFloat(mov.monto)
                        }
                    });
                    saldos.push(deuda)
                }).then(() => {
                    if (i == (deudas.length - 1)) {
                        res.send(saldos)
                    }
                })
            }
        } else {
            res.send(saldos)
        }
    })
}

/* API Deudas Financieras */
contableController.getDeudasFinancieras = (req, res) => {
    var fecha = new Date(req.params.fecha)
    var saldos = []

    DeudaFinanciera.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(deudas => {
        if (deudas.length > 0) {
            for (let i = 0; i < deudas.length; i++) {
                const deuda = deudas[i];

                deuda.dataValues.saldo = parseFloat(deuda.monto)
                MovimientoCompra.findAll({
                    where: {
                        concepto: 'DeudaFinanciera',
                        conceptoId: deuda.deudaFinancieraId
                    }
                }).then(movimientos => {
                    movimientos.forEach(mov => {
                        if (new Date(mov.fecha) <= fecha) {
                            deuda.dataValues.saldo -= parseFloat(mov.monto)
                        }
                    });
                    saldos.push(deuda)
                }).then(() => {
                    if (i == (deudas.length - 1)) {
                        res.send(saldos)
                    }
                })
            }
        } else {
            res.send(saldos)
        }
    })
}

/* API Deudas Fiscales */
contableController.getDeudasFiscales = (req, res) => {
    var fecha = new Date(req.params.fecha)
    var saldos = []

    DeudaFiscal.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(deudas => {
        if (deudas.length > 0) {
            for (let i = 0; i < deudas.length; i++) {
                const deuda = deudas[i];

                deuda.dataValues.saldo = parseFloat(deuda.monto)
                MovimientoCompra.findAll({
                    where: {
                        concepto: 'DeudaFiscal',
                        conceptoId: deuda.deudaFiscalId
                    }
                }).then(movimientos => {
                    movimientos.forEach(mov => {
                        if (new Date(mov.fecha) <= fecha) {
                            deuda.dataValues.saldo -= parseFloat(mov.monto)
                        }
                    });
                    saldos.push(deuda)
                }).then(() => {
                    if (i == (deudas.length - 1)) {
                        res.send(saldos)
                    }
                })
            }
        } else {
            res.send(saldos)
        }
    })
}

/* API Deudas Sociales */
contableController.getDeudasSociales = (req, res) => {
    var fecha = new Date(req.params.fecha)
    var saldos = []

    DeudaSocial.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(deudas => {
        if (deudas.length > 0) {
            for (let i = 0; i < deudas.length; i++) {
                const deuda = deudas[i];

                deuda.dataValues.saldo = parseFloat(deuda.monto)
                MovimientoCompra.findAll({
                    where: {
                        concepto: 'DeudaSocial',
                        conceptoId: deuda.deudaSocialId
                    }
                }).then(movimientos => {
                    movimientos.forEach(mov => {
                        if (new Date(mov.fecha) <= fecha) {
                            deuda.dataValues.saldo -= parseFloat(mov.monto)
                        }
                    });
                    saldos.push(deuda)
                }).then(() => {
                    if (i == (deudas.length - 1)) {
                        res.send(saldos)
                    }
                })
            }
        } else {
            res.send(saldos)
        }
    })
}

/* API Otras Deudas */
contableController.getDeudasOtras = (req, res) => {
    var fecha = new Date(req.params.fecha)
    var saldos = []

    DeudaOtra.findAll({
        where: {
            empresaId: req.params.empresaId
        }
    }).then(deudas => {
        if (deudas.length > 0) {
            for (let i = 0; i < deudas.length; i++) {
                const deuda = deudas[i];

                deuda.dataValues.saldo = parseFloat(deuda.monto)
                MovimientoCompra.findAll({
                    where: {
                        concepto: 'DeudaOtra',
                        conceptoId: deuda.deudaOtraId
                    }
                }).then(movimientos => {
                    movimientos.forEach(mov => {
                        if (new Date(mov.fecha) <= fecha) {
                            deuda.dataValues.saldo -= parseFloat(mov.monto)
                        }
                    });
                    saldos.push(deuda)
                }).then(() => {
                    if (i == (deudas.length - 1)) {
                        res.send(saldos)
                    }
                })
            }
        } else {
            res.send(saldos)
        }
    })
}


module.exports = contableController;