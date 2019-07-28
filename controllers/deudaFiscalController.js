const Movimientos = require("../utils/movimientos")
const models = require("../models");
const DeudaFiscal = models.DeudaFiscal;
const Caja = models.Caja;
const Banco = models.Banco;

var deudaFiscalController = {};

deudaFiscalController.list = function (req, res) {
    DeudaFiscal.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(deudas => {
        deudas.forEach(deuda => {
            deuda.dataValues.importeCuota = (deuda.monto / deuda.cantCuotas) * (deuda.porcEjercicio / 100)
        })

        res.render("recursos/deudaFiscal/deudaFiscal-list", {
            deudas: deudas
        });
    });
};

deudaFiscalController.add = function (req, res) {
    let reqDeudaFiscal = req.body.deudaFiscal
    let empresaInicioEjercicio = new Date(Date.parse(res.locals.empresa.inicioEjercicio))
    
    DeudaFiscal.create(reqDeudaFiscal).then(deuda => {
        if (deuda.cuenta == 'Caja') {
            Caja.findOne({
                where: {
                    empresaId: res.locals.empresa.empresaId
                }
            }).then(async caja => {
                
                await generarMovimientos(deuda, caja.cajaId, empresaInicioEjercicio)
                
                req.flash("success_msg", "Se dio de alta una deuda fiscal correctamente");
                res.redirect("/deudasFiscales");
            })
        }
        
        if (deuda.cuenta == 'Banco') {
            Banco.findOne({
                where: {
                    empresaId: res.locals.empresa.empresaId
                }
            }).then(async banco => {
                
                await generarMovimientos(deuda, banco.bancoId, empresaInicioEjercicio)
                
                req.flash("success_msg", "Se dio de alta una deuda fiscal correctamente");
                res.redirect("/deudasFiscales");
            })
        }
        
    })
    .catch(error => {
        console.log(error)
        req.flash("error_msg", "Error al dar de alta una deuda fiscal");
        res.redirect("/deudasFiscales");
    });
};

deudaFiscalController.saveEdit = function (req, res) {
    let reqDeudaFiscal = req.body.deudaFiscal
    let empresaInicioEjercicio = new Date(Date.parse(res.locals.empresa.inicioEjercicio))

    DeudaFiscal.findByPk(req.params.id).then(deuda => {
        deuda
            .update(reqDeudaFiscal)
            .then(async () => {
                await Movimientos.deshacerCompra('DeudaFiscal', req.params.id)

                if (deuda.cuenta == 'Caja') {
                    Caja.findOne({
                        where: {
                            empresaId: res.locals.empresa.empresaId
                        }
                    }).then(async caja => {

                        await generarMovimientos(deuda, caja.cajaId, empresaInicioEjercicio)

                        req.flash("success_msg", "Se actualizó una deuda fiscal correctamente");
                        res.redirect("/deudasFiscales");
                    })
                }
                
                if (deuda.cuenta == 'Banco') {
                    Banco.findOne({
                        where: {
                            empresaId: res.locals.empresa.empresaId
                        }
                    }).then(async banco => {
                        
                        await generarMovimientos(deuda, banco.bancoId, empresaInicioEjercicio)
                        
                        req.flash("success_msg", "Se actualizó un deuda fiscal correctamente");
                        res.redirect("/deudasFiscales");
                    })
                }
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar una deuda fiscal");
                res.redirect("/deudasFiscales");
            });
    });
};

deudaFiscalController.delete = function (req, res) {
    DeudaFiscal.destroy({
            where: {
                deudaFiscalId: req.params.id
            }
        }).then(async () => {
            await Movimientos.deshacerCompra('DeudaFiscal', req.params.id)

            req.flash("success_msg", "Se dio de baja una deuda fiscal correctamente");
            res.redirect("/deudasFiscales");
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al dar de baja una deuda fiscal");
            res.redirect("/deudasFiscales");
        });
};


async function generarMovimientos(deuda, cuentaId, empresaInicioEjercicio) {
    let mes = empresaInicioEjercicio.getMonth() + 1
    let anio = empresaInicioEjercicio.getFullYear()
    let importeCuota = (deuda.monto / deuda.cantCuotas) * (deuda.porcEjercicio / 100)
    for (let i = 1; i < 13; i++) {
        if (!(mes < 12)) {
            mes = 0
            anio += 1
        }
        let fecha = new Date(anio, mes, 1)

        if (i == 1 && deuda.mes1) {
            await Movimientos.compra(fecha, importeCuota, 'DeudaFiscal', deuda.deudaFiscalId, deuda.cuenta, cuentaId, deuda.empresaId)
        }

        if (i == 2 && deuda.mes2) {
            await Movimientos.compra(fecha, importeCuota, 'DeudaFiscal', deuda.deudaFiscalId, deuda.cuenta, cuentaId, deuda.empresaId)
        }

        if (i == 3 && deuda.mes3) {
            await Movimientos.compra(fecha, importeCuota, 'DeudaFiscal', deuda.deudaFiscalId, deuda.cuenta, cuentaId, deuda.empresaId)
        }

        if (i == 4 && deuda.mes4) {
            await Movimientos.compra(fecha, importeCuota, 'DeudaFiscal', deuda.deudaFiscalId, deuda.cuenta, cuentaId, deuda.empresaId)
        }

        if (i == 5 && deuda.mes5) {
            await Movimientos.compra(fecha, importeCuota, 'DeudaFiscal', deuda.deudaFiscalId, deuda.cuenta, cuentaId, deuda.empresaId)
        }

        if (i == 6 && deuda.mes6) {
            await Movimientos.compra(fecha, importeCuota, 'DeudaFiscal', deuda.deudaFiscalId, deuda.cuenta, cuentaId, deuda.empresaId)
        }

        if (i == 7 && deuda.mes7) {
            await Movimientos.compra(fecha, importeCuota, 'DeudaFiscal', deuda.deudaFiscalId, deuda.cuenta, cuentaId, deuda.empresaId)
        }

        if (i == 8 && deuda.mes8) {
            await Movimientos.compra(fecha, importeCuota, 'DeudaFiscal', deuda.deudaFiscalId, deuda.cuenta, cuentaId, deuda.empresaId)
        }

        if (i == 9 && deuda.mes9) {
            await Movimientos.compra(fecha, importeCuota, 'DeudaFiscal', deuda.deudaFiscalId, deuda.cuenta, cuentaId, deuda.empresaId)
        }

        if (i == 10 && deuda.mes10) {
            await Movimientos.compra(fecha, importeCuota, 'DeudaFiscal', deuda.deudaFiscalId, deuda.cuenta, cuentaId, deuda.empresaId)
        }

        if (i == 11 && deuda.mes11) {
            await Movimientos.compra(fecha, importeCuota, 'DeudaFiscal', deuda.deudaFiscalId, deuda.cuenta, cuentaId, deuda.empresaId)
        }

        if (i == 12 && deuda.mes12) {
            await Movimientos.compra(fecha, importeCuota, 'DeudaFiscal', deuda.deudaFiscalId, deuda.cuenta, cuentaId, deuda.empresaId)
        }

        mes += 1
    }
}

module.exports = deudaFiscalController;