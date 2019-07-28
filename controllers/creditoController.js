const Movimientos = require("./../utils/movimientos")
const models = require("./../models");
const Credito = models.Credito;
const Caja = models.Caja;
const Banco = models.Banco;

var creditoController = {};

creditoController.list = function (req, res) {
    Credito.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(creditos => {
        creditos.forEach(credito => {
            credito.dataValues.importeCuota = (credito.monto / credito.cantCuotas) * (credito.porcEjercicio / 100)
        })

        res.render("recursos/credito/credito-list", {
            creditos: creditos
        });
    });
};

creditoController.add = function (req, res) {
    let reqCredito = req.body.credito
    let empresaInicioEjercicio = new Date(Date.parse(res.locals.empresa.inicioEjercicio))
    
    Credito.create(reqCredito).then(credito => {
        if (credito.cuenta == 'Caja') {
            Caja.findOne({
                where: {
                    empresaId: res.locals.empresa.empresaId
                }
            }).then(async caja => {
                
                await generarMovimientos(credito, caja.cajaId, empresaInicioEjercicio)
                
                req.flash("success_msg", "Se dio de alta un credito correctamente");
                res.redirect("/creditos");
            })
        }
        
        if (credito.cuenta == 'Banco') {
            Banco.findOne({
                where: {
                    empresaId: res.locals.empresa.empresaId
                }
            }).then(async banco => {
                
                await generarMovimientos(credito, banco.bancoId, empresaInicioEjercicio)
                
                req.flash("success_msg", "Se dio de alta un credito correctamente");
                res.redirect("/creditos");
            })
        }
        
    })
    .catch(error => {
        console.log(error)
        req.flash("error_msg", "Error al dar de alta un credito");
        res.redirect("/creditos");
    });
};

creditoController.saveEdit = function (req, res) {
    let reqCredito = req.body.credito
    let empresaInicioEjercicio = new Date(Date.parse(res.locals.empresa.inicioEjercicio))

    Credito.findByPk(req.params.id).then(credito => {
        credito
            .update(reqCredito)
            .then(async () => {
                await Movimientos.deshacerVenta('Credito', req.params.id)

                if (credito.cuenta == 'Caja') {
                    Caja.findOne({
                        where: {
                            empresaId: res.locals.empresa.empresaId
                        }
                    }).then(async caja => {

                        await generarMovimientos(credito, caja.cajaId, empresaInicioEjercicio)

                        req.flash("success_msg", "Se actualizó un credito correctamente");
                        res.redirect("/creditos");
                    })
                }
                
                if (credito.cuenta == 'Banco') {
                    Banco.findOne({
                        where: {
                            empresaId: res.locals.empresa.empresaId
                        }
                    }).then(async banco => {
                        
                        await generarMovimientos(credito, banco.bancoId, empresaInicioEjercicio)
                        
                        req.flash("success_msg", "Se actualizó un credito correctamente");
                        res.redirect("/creditos");
                    })
                }
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar un credito");
                res.redirect("/creditos");
            });
    });
};

creditoController.delete = function (req, res) {
    Credito.destroy({
            where: {
                creditoId: req.params.id
            }
        }).then(async () => {
            await Movimientos.deshacerVenta('Credito', req.params.id)

            req.flash("success_msg", "Se dio de baja un credito correctamente");
            res.redirect("/creditos");
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al dar de baja un credito");
            res.redirect("/creditos");
        });
};


async function generarMovimientos(credito, cuentaId, empresaInicioEjercicio) {
    let mes = empresaInicioEjercicio.getMonth() + 1
    let anio = empresaInicioEjercicio.getFullYear()
    let importeCuota = (credito.monto / credito.cantCuotas) * (credito.porcEjercicio / 100)
    for (let i = 1; i < 13; i++) {
        if (!(mes < 12)) {
            mes = 0
            anio += 1
        }
        let fecha = new Date(anio, mes, 1)

        if (i == 1 && credito.mes1) {
            await Movimientos.venta(fecha, importeCuota, 'Credito', credito.creditoId, credito.cuenta, cuentaId, credito.empresaId)
        }

        if (i == 2 && credito.mes2) {
            await Movimientos.venta(fecha, importeCuota, 'Credito', credito.creditoId, credito.cuenta, cuentaId, credito.empresaId)
        }

        if (i == 3 && credito.mes3) {
            await Movimientos.venta(fecha, importeCuota, 'Credito', credito.creditoId, credito.cuenta, cuentaId, credito.empresaId)
        }

        if (i == 4 && credito.mes4) {
            await Movimientos.venta(fecha, importeCuota, 'Credito', credito.creditoId, credito.cuenta, cuentaId, credito.empresaId)
        }

        if (i == 5 && credito.mes5) {
            await Movimientos.venta(fecha, importeCuota, 'Credito', credito.creditoId, credito.cuenta, cuentaId, credito.empresaId)
        }

        if (i == 6 && credito.mes6) {
            await Movimientos.venta(fecha, importeCuota, 'Credito', credito.creditoId, credito.cuenta, cuentaId, credito.empresaId)
        }

        if (i == 7 && credito.mes7) {
            await Movimientos.venta(fecha, importeCuota, 'Credito', credito.creditoId, credito.cuenta, cuentaId, credito.empresaId)
        }

        if (i == 8 && credito.mes8) {
            await Movimientos.venta(fecha, importeCuota, 'Credito', credito.creditoId, credito.cuenta, cuentaId, credito.empresaId)
        }

        if (i == 9 && credito.mes9) {
            await Movimientos.venta(fecha, importeCuota, 'Credito', credito.creditoId, credito.cuenta, cuentaId, credito.empresaId)
        }

        if (i == 10 && credito.mes10) {
            await Movimientos.venta(fecha, importeCuota, 'Credito', credito.creditoId, credito.cuenta, cuentaId, credito.empresaId)
        }

        if (i == 11 && credito.mes11) {
            await Movimientos.venta(fecha, importeCuota, 'Credito', credito.creditoId, credito.cuenta, cuentaId, credito.empresaId)
        }

        if (i == 12 && credito.mes12) {
            await Movimientos.venta(fecha, importeCuota, 'Credito', credito.creditoId, credito.cuenta, cuentaId, credito.empresaId)
        }

        mes += 1
    }
}

module.exports = creditoController;