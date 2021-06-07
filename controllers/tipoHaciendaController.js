const models = require("./../models");
const sendReport = require("../utils/sendReport");
const TipoHacienda = models.TipoHacienda;
const Hacienda = models.Hacienda;
const CategoriaHacienda = models.CategoriaHacienda;
const Movimiento = models.Movimiento;

var tipoHaciendaController = {};

tipoHaciendaController.list = function (req, res) {
    TipoHacienda.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(tiposHacienda => {
        res.render("ganaderia/tipoHacienda/tipoHacienda-list", {
            tiposHacienda: tiposHacienda
        });
    });
};

tipoHaciendaController.add = function (req, res) {
    var reqTipoHacienda = req.body.tipoHacienda
    TipoHacienda.create(reqTipoHacienda).then(tipoHacienda => {
        req.flash("success_msg", "Se dio de alta un Tipo de Hacienda correctamente");
        res.redirect("/tiposHacienda");
    })
        .catch(error => {
            console.log(error)
            req.flash("error_msg", "Error al dar de alta un Tipo de Hacienda");
            res.redirect("/tiposHacienda");
        });
};

tipoHaciendaController.getbyId = function (req, res) {
    TipoHacienda.findAll({
        where: {
            tipoHaciendaId: req.params.id
        }
    }).then(tipoHacienda => {
        res.send({
            tipoHacienda
        })
    })
};

tipoHaciendaController.saveEdit = function (req, res) {
    var reqTipoHacienda = req.body.tipoHacienda

    TipoHacienda.findByPk(req.params.id).then(tipoHacienda => {
        tipoHacienda
            .update(reqTipoHacienda)
            .then(async () => {
                req.flash("success_msg", "Se actualizó un Tipo de Hacienda correctamente");
                res.redirect("/tiposHacienda");
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar un Tipo de Hacienda");
                res.redirect("/tiposHacienda");
            });
    });
};

tipoHaciendaController.delete = function (req, res) {
    TipoHacienda.destroy({
        where: {
            tipoHaciendaId: req.params.id
        }
    }).then(async () => {
        req.flash("success_msg", "Se dio de baja un Tipo de Hacienda correctamente");
        res.redirect("/tiposHacienda");
    })
        .catch(err => {
            console.log(err)
            if (err.parent.errno == 1451) {
                req.flash("error_msg", "Error al dar de baja un Tipo de Hacienda, el registro se encuentra referenciado");
            } else {
                req.flash("error_msg", "Error al dar de baja un Tipo de Hacienda");
            }
            res.redirect("/tiposHacienda");
        });
};

tipoHaciendaController.rptEvolucionRodeo = function (req, res) {
    TipoHacienda.findByPk(req.params.id).then(tipoHacienda => {
        TipoHacienda.findAll({
            where: {
                tipoHaciendaId: req.params.id
            }
        }).then(tipoHacienda => {
            CategoriaHacienda.findAll({
                where: {
                    empresaId: res.locals.empresa.empresaId,
                    tipoHaciendaId: req.params.id
                }
            }).then(categoriaHacienda => {
                Hacienda.findAll({
                    where: {
                        empresaId: res.locals.empresa.empresaId,
                        tipoHaciendaId: req.params.id,
                    }
                }).then(hacienda => {
                    Movimiento.findAll({
                        where: {
                            empresaId: res.locals.empresa.empresaId,
                            tipoHaciendaId: req.params.id,
                        }
                    }).then(Movimiento => {
                            res.send({
                                tipoHacienda,
                                categoriaHacienda,
                                hacienda,
                                Movimiento
                            })
                            let datos = {
                                tipoHacienda,
                                categoriaHacienda,
                                hacienda,
                                Movimiento
                            }
                            sendReport("evolucionRodeo", datos, res, "landscape")
                        })
                })
            })
        })
    })
};

module.exports = tipoHaciendaController;