const models = require("./../models");
const sendReport = require("../utils/sendReport");
const GanaderiaActividades = models.GanaderiaActividades;
const GanaderiaRubro = models.GanaderiaRubro;
const GanaderiaConcepto = models.GanaderiaConcepto
const GanaderiaGastoDirecto = models.GanaderiaGastoDirecto

var ganaderiaGastoDirectoController = {};

ganaderiaGastoDirectoController.list = function (req, res) {
    GanaderiaActividades.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(actividades => {
        var actividadesAct = null;

        if (req.params.actividadesId) {
            actividades.forEach(c => {
                if (c.actividadesId == req.params.actividadesId) {
                    actividadesAct = c;
                }
            });
            if (!actividadesAct) {
                actividadesAct = actividades[0]
            }
        } else {
            actividadesAct = actividades[0]
        }

        GanaderiaRubro.findAll({
            where: {
                empresaId: res.locals.empresa.empresaId
            }
        }).then(rubros => {
            GanaderiaConcepto.findAll({
                where: {
                    empresaId: res.locals.empresa.empresaId
                }
            }).then(conceptos => {
                if (actividadesAct) {
                    GanaderiaGastoDirecto.findAll({
                        where: {
                            empresaId: res.locals.empresa.empresaId,
                            actividadesId: actividadesAct.actividadesId
                        },
                        include: [{
                                model: GanaderiaRubro
                            },
                            {
                                model: GanaderiaConcepto
                            }
                        ]
                    }).then(gastosDirectos => {
                        res.render('ganaderia/gastoDirecto/gastoDirecto-list', {
                            actividadesAct,
                            actividades,
                            rubros,
                            conceptos,
                            gastosDirectos
                        })
                    })
                } else {
                    var gastosDirectos = []
                    res.render('ganaderia/gastoDirecto/gastoDirecto-list', {
                            actividadesAct,
                            actividades,
                            rubros,
                            conceptos,
                            gastosDirectos
                    })
                }

            })
        });

    })
};


ganaderiaGastoDirectoController.add = function (req, res) {
    var reqGastoDirecto = req.body.ganaderiaGastoDirecto
    GanaderiaGastoDirecto.create(reqGastoDirecto).then(gastoDirecto => {
            req.flash("success_msg", "Se dio de alta un Gasto Directo");
            res.redirect(req.headers.referer);
        })
        .catch(error => {
            console.log(error)
            req.flash("error_msg", "Error al dar de alta un Gasto Directo");
            res.redirect(req.headers.referer);
        });
};

ganaderiaGastoDirectoController.saveEdit = function (req, res) {
    var reqGastoDirecto = req.body.ganaderiaGastoDirecto

    GanaderiaGastoDirecto.findByPk(req.params.id).then(gastoDirecto => {
        gastoDirecto
            .update(reqGastoDirecto)
            .then(c => {
                req.flash("success_msg", "Se actualizó un Gasto Directo correctamente");
                res.redirect(req.headers.referer);
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar un Gasto Directo");
                res.redirect(req.headers.referer);
            });
    });
};


ganaderiaGastoDirectoController.delete = function (req, res) {
    GanaderiaGastoDirecto.destroy({
            where: {
                gastoDirectoId: req.params.id
            }
        }).then(() => {
            req.flash("success_msg", "Se dio de baja un Gasto Directo correctamente");
            res.redirect(req.headers.referer);
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al dar de baja un Gasto Directo");
            res.redirect(req.headers.referer);
        });
};


module.exports = ganaderiaGastoDirectoController;


