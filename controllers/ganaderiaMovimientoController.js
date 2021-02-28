const models = require("./../models");
const Hacienda = models.Hacienda;
const TipoHacienda = models.TipoHacienda;
const CategoriaHacienda = models.CategoriaHacienda
const Movimientos = models.Movimiento

var GanaderiaMovimientoController = {};

GanaderiaMovimientoController.list = function (req, res) {
    Hacienda.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        },
        include: [{
            model: TipoHacienda
        },
         {
            model: CategoriaHacienda
        }],
    }).then(resgHacienda => {
        var HaciendaAct = null;

        if (req.params.haciendaId) {
            resgHacienda.forEach(c => {
                if (c.haciendaId == req.params.haciendaId) {
                    HaciendaAct = c;
                }
            });
            if (!HaciendaAct) {
                HaciendaAct = resgHacienda[0]
            }
        } else {
            HaciendaAct = resgHacienda[0]
        }
        TipoHacienda.findAll({
            where: {
                empresaId: res.locals.empresa.empresaId
            }
        }).then(tipoHacienda => {
            CategoriaHacienda.findAll({
                where: {
                    empresaId: res.locals.empresa.empresaId,
                }
            }).then(categoriaHacienda => {
                if (HaciendaAct) {
                    Movimientos.findAll({
                        where: {
                            empresaId: res.locals.empresa.empresaId,
                            haciendaId: HaciendaAct.haciendaId
                        },
                        include: [{
                            model: TipoHacienda
                        },
                         {
                            model: CategoriaHacienda
                        },
                        ]
                    }).then(movimientos => {
                        res.render('ganaderia/movimiento/movimiento-list', {
                            HaciendaAct,
                            resgHacienda,
                            tipoHacienda,
                            categoriaHacienda,
                            movimientos
                        })
                    })
                } else {
                    var movimientos = []
                    res.render('ganaderia/movimiento/movimiento-list', {
                        HaciendaAct,
                        resgHacienda,
                        tipoHacienda,
                        categoriaHacienda,
                        movimientos
                    })
                }
            });
        })
    });
};


GanaderiaMovimientoController.add = function (req, res) {
    var reqMovimiento = req.body.movimiento
    Movimientos.create(reqMovimiento).then(movimiento => {
        req.flash("success_msg", "Se dio de alta un Movimiento");
        res.redirect(req.headers.referer);
    })
        .catch(error => {
            console.log(error)
            req.flash("error_msg", "Error al dar de alta un Movimiento");
            res.redirect(req.headers.referer);
        });
};

GanaderiaMovimientoController.saveEdit = function (req, res) {
    var reqMovimiento = req.body.movimiento
    Movimientos.findByPk(req.params.id).then(movimiento => {
        movimiento
            .update(reqMovimiento)
            .then(c => {
                req.flash("success_msg", "Se actualizó un Gasto Directo correctamente");
                res.redirect(req.headers.referer);
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar un Movimiento");
                res.redirect(req.headers.referer);
            });
    });
};

GanaderiaMovimientoController.delete = function (req, res) {
    Movimientos.destroy({
        where: {
            movimientoId: req.params.id
        }
        }).then(() => {
            req.flash("success_msg", "Se dio de baja un Movimiento correctamente");
            res.redirect(req.headers.referer);
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al dar de baja un Movimiento");
            res.redirect(req.headers.referer);
        });
};


module.exports = GanaderiaMovimientoController;


