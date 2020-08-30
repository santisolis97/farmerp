const models = require("./../models");
const sendReport = require("../utils/sendReport");
const Cultivo = models.Cultivo;
const Rubro = models.Rubro;
const Concepto = models.Concepto
const AgriculturaGastoDirecto = models.AgriculturaGastoDirecto

var agriculturaGastoDirectoController = {};

agriculturaGastoDirectoController.list = function (req, res) {
    Cultivo.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(cultivos => {
        var cultivoAct = null;

        if (req.params.cultivoId) {
            cultivos.forEach(c => {
                if (c.cultivoId == req.params.cultivoId) {
                    cultivoAct = c;
                }
            });
            if (!cultivoAct) {
                cultivoAct = cultivos[0]
            }
        } else {
            cultivoAct = cultivos[0]
        }

        Rubro.findAll({
            where: {
                empresaId: res.locals.empresa.empresaId
            }
        }).then(rubros => {
            Concepto.findAll({
                where: {
                    empresaId: res.locals.empresa.empresaId
                }
            }).then(conceptos => {
                if (cultivoAct) {
                    AgriculturaGastoDirecto.findAll({
                        where: {
                            empresaId: res.locals.empresa.empresaId,
                            cultivoId: cultivoAct.cultivoId
                        },
                        include: [{
                                model: Rubro
                            },
                            {
                                model: Concepto
                            }
                        ]
                    }).then(gastosDirectos => {
                        res.render('agricultura/gastoDirecto/gastoDirecto-list', {
                            cultivoAct,
                            cultivos,
                            rubros,
                            conceptos,
                            gastosDirectos
                        })
                    })
                } else {
                    var gastosDirectos = []
                    res.render('agricultura/gastoDirecto/gastoDirecto-list', {
                        cultivoAct,
                        cultivos,
                        rubros,
                        conceptos,
                        gastosDirectos
                    })
                }

            })
        });

    })
};


agriculturaGastoDirectoController.add = function (req, res) {
    var reqGastoDirecto = req.body.agriculturaGastoDirecto
    AgriculturaGastoDirecto.create(reqGastoDirecto).then(gastoDirecto => {
            req.flash("success_msg", "Se dio de alta un Gasto Directo");
            res.redirect(req.headers.referer);
        })
        .catch(error => {
            console.log(error)
            req.flash("error_msg", "Error al dar de alta un Gasto Directo");
            res.redirect(req.headers.referer);
        });
};

agriculturaGastoDirectoController.saveEdit = function (req, res) {
    var reqGastoDirecto = req.body.agriculturaGastoDirecto

    AgriculturaGastoDirecto.findByPk(req.params.id).then(gastoDirecto => {
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


agriculturaGastoDirectoController.delete = function (req, res) {
    AgriculturaGastoDirecto.destroy({
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


agriculturaGastoDirectoController.rptProgramaFisico = function (req, res) {
    Cultivo.findByPk(req.params.id).then(cultivo => {
        AgriculturaGastoDirecto.findAll({
            where: {
                empresaId: res.locals.empresa.empresaId,
                cultivoId: req.params.id
            },
            include: [{
                    model: Rubro
                },
                {
                    model: Concepto
                }
            ]
        }).then(gastosDirectos => {
            let empresa = res.locals.empresa
            let datos = {
                empresa,
                cultivo,
                gastosDirectos
            }

            sendReport("agriculturaProgramaFisico", datos, res, "landscape")
        })
    })
};

module.exports = agriculturaGastoDirectoController;


