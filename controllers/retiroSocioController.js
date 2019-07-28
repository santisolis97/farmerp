const Movimientos = require("../utils/movimientos")
const models = require("../models");
const RetiroSocio = models.RetiroSocio;
const Caja = models.Caja;
const Banco = models.Banco;

var retiroSocioController = {};

retiroSocioController.list = function (req, res) {
    RetiroSocio.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(retiroSocios => {
        retiroSocios.forEach(retiroSocio => {
            retiroSocio.dataValues.importeCuota = (retiroSocio.monto / retiroSocio.cantCuotas) * (retiroSocio.porcEjercicio / 100)
        })

        res.render("recursos/retiroSocio/retiroSocio-list", {
            retiroSocios: retiroSocios
        });
    });
};

retiroSocioController.add = function (req, res) {
    let reqRetiroSocio = req.body.retiroSocio
    let empresaInicioEjercicio = new Date(Date.parse(res.locals.empresa.inicioEjercicio))
    
    RetiroSocio.create(reqRetiroSocio).then(retiroSocio => {
        if (retiroSocio.cuenta == 'Caja') {
            Caja.findOne({
                where: {
                    empresaId: res.locals.empresa.empresaId
                }
            }).then(async caja => {
                
                await generarMovimientos(retiroSocio, caja.cajaId, empresaInicioEjercicio)
                
                req.flash("success_msg", "Se dio de alta un retiro de socio correctamente");
                res.redirect("/retiroSocios");
            })
        }
        
        if (retiroSocio.cuenta == 'Banco') {
            Banco.findOne({
                where: {
                    empresaId: res.locals.empresa.empresaId
                }
            }).then(async banco => {
                
                await generarMovimientos(retiroSocio, banco.bancoId, empresaInicioEjercicio)
                
                req.flash("success_msg", "Se dio de alta un retiro de socio correctamente");
                res.redirect("/retiroSocios");
            })
        }
        
    })
    .catch(error => {
        console.log(error)
        req.flash("error_msg", "Error al dar de alta un retiro de socio");
        res.redirect("/retiroSocios");
    });
};

retiroSocioController.saveEdit = function (req, res) {
    let reqRetiroSocio = req.body.retiroSocio
    let empresaInicioEjercicio = new Date(Date.parse(res.locals.empresa.inicioEjercicio))

    RetiroSocio.findByPk(req.params.id).then(retiroSocio => {
        retiroSocio
            .update(reqRetiroSocio)
            .then(async () => {
                await Movimientos.deshacerCompra('RetiroSocio', req.params.id)

                if (retiroSocio.cuenta == 'Caja') {
                    Caja.findOne({
                        where: {
                            empresaId: res.locals.empresa.empresaId
                        }
                    }).then(async caja => {

                        await generarMovimientos(retiroSocio, caja.cajaId, empresaInicioEjercicio)

                        req.flash("success_msg", "Se actualizó un retiro de socio correctamente");
                        res.redirect("/retiroSocios");
                    })
                }
                
                if (retiroSocio.cuenta == 'Banco') {
                    Banco.findOne({
                        where: {
                            empresaId: res.locals.empresa.empresaId
                        }
                    }).then(async banco => {
                        
                        await generarMovimientos(retiroSocio, banco.bancoId, empresaInicioEjercicio)
                        
                        req.flash("success_msg", "Se actualizó un retiroSocio fiscal correctamente");
                        res.redirect("/retiroSocios");
                    })
                }
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar un retiro de socio");
                res.redirect("/retiroSocios");
            });
    });
};

retiroSocioController.delete = function (req, res) {
    RetiroSocio.destroy({
            where: {
                retiroSocioId: req.params.id
            }
        }).then(async () => {
            await Movimientos.deshacerCompra('RetiroSocio', req.params.id)

            req.flash("success_msg", "Se dio de baja un retiro de socio correctamente");
            res.redirect("/retiroSocios");
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al dar de baja un retiro de socio");
            res.redirect("/retiroSocios");
        });
};


async function generarMovimientos(retiroSocio, cuentaId, empresaInicioEjercicio) {
    let mes = empresaInicioEjercicio.getMonth() + 1
    let anio = empresaInicioEjercicio.getFullYear()
    let importeCuota = (retiroSocio.monto / retiroSocio.cantCuotas) * (retiroSocio.porcEjercicio / 100)
    for (let i = 1; i < 13; i++) {
        if (!(mes < 12)) {
            mes = 0
            anio += 1
        }
        let fecha = new Date(anio, mes, 1)

        if (i == 1 && retiroSocio.mes1) {
            await Movimientos.compra(fecha, importeCuota, 'RetiroSocio', retiroSocio.retiroSocioId, retiroSocio.cuenta, cuentaId, retiroSocio.empresaId)
        }

        if (i == 2 && retiroSocio.mes2) {
            await Movimientos.compra(fecha, importeCuota, 'RetiroSocio', retiroSocio.retiroSocioId, retiroSocio.cuenta, cuentaId, retiroSocio.empresaId)
        }

        if (i == 3 && retiroSocio.mes3) {
            await Movimientos.compra(fecha, importeCuota, 'RetiroSocio', retiroSocio.retiroSocioId, retiroSocio.cuenta, cuentaId, retiroSocio.empresaId)
        }

        if (i == 4 && retiroSocio.mes4) {
            await Movimientos.compra(fecha, importeCuota, 'RetiroSocio', retiroSocio.retiroSocioId, retiroSocio.cuenta, cuentaId, retiroSocio.empresaId)
        }

        if (i == 5 && retiroSocio.mes5) {
            await Movimientos.compra(fecha, importeCuota, 'RetiroSocio', retiroSocio.retiroSocioId, retiroSocio.cuenta, cuentaId, retiroSocio.empresaId)
        }

        if (i == 6 && retiroSocio.mes6) {
            await Movimientos.compra(fecha, importeCuota, 'RetiroSocio', retiroSocio.retiroSocioId, retiroSocio.cuenta, cuentaId, retiroSocio.empresaId)
        }

        if (i == 7 && retiroSocio.mes7) {
            await Movimientos.compra(fecha, importeCuota, 'RetiroSocio', retiroSocio.retiroSocioId, retiroSocio.cuenta, cuentaId, retiroSocio.empresaId)
        }

        if (i == 8 && retiroSocio.mes8) {
            await Movimientos.compra(fecha, importeCuota, 'RetiroSocio', retiroSocio.retiroSocioId, retiroSocio.cuenta, cuentaId, retiroSocio.empresaId)
        }

        if (i == 9 && retiroSocio.mes9) {
            await Movimientos.compra(fecha, importeCuota, 'RetiroSocio', retiroSocio.retiroSocioId, retiroSocio.cuenta, cuentaId, retiroSocio.empresaId)
        }

        if (i == 10 && retiroSocio.mes10) {
            await Movimientos.compra(fecha, importeCuota, 'RetiroSocio', retiroSocio.retiroSocioId, retiroSocio.cuenta, cuentaId, retiroSocio.empresaId)
        }

        if (i == 11 && retiroSocio.mes11) {
            await Movimientos.compra(fecha, importeCuota, 'RetiroSocio', retiroSocio.retiroSocioId, retiroSocio.cuenta, cuentaId, retiroSocio.empresaId)
        }

        if (i == 12 && retiroSocio.mes12) {
            await Movimientos.compra(fecha, importeCuota, 'RetiroSocio', retiroSocio.retiroSocioId, retiroSocio.cuenta, cuentaId, retiroSocio.empresaId)
        }

        mes += 1
    }
}

module.exports = retiroSocioController;