const models = require("./../models");
const GanaderiaActividad = models.GanaderiaActividades;

var ganaderiaActividadesController = {};

ganaderiaActividadesController.list = function (req, res) {
    GanaderiaActividad.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(ganaderiaActividades => {
        res.render("ganaderia/actividades/actividades-list", {
            ganaderiaActividades
        })
    })
};

ganaderiaActividadesController.add = function (req, res) {
    var reqGanaderiaActividades = req.body.ganaderiaActividades
    GanaderiaActividad.create(reqGanaderiaActividades).then(ganaderiaActividades => {
            req.flash("success_msg", "Se dio de alta una actividad en ganaderia");
            res.redirect("/ganaderiaActividades");
        })
        .catch(error => {
            console.log(error)
            req.flash("error_msg", "Error al dar de alta una actividad en ganaderia");
            res.redirect("/ganaderiaActividades");
        });
};

ganaderiaActividadesController.saveEdit = function (req, res) {
    var reqGanaderiaActividades = req.body.ganaderiaActividades

    GanaderiaActividad.findByPk(req.params.id).then(ganaderiaActividades => {
        ganaderiaActividades
            .update(reqGanaderiaActividades)
            .then(c => {
                req.flash("success_msg", "Se actualizó una actividad en ganaderia correctamente");
                res.redirect("/ganaderiaActividades");
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar una actividad en ganaderia");
                res.redirect("/ganaderiaActividades");
            });
    });
};

ganaderiaActividadesController.delete = function (req, res) {
    GanaderiaActividad.destroy({
            where: {
                actividadesId: req.params.id
            }
        }).then(() => {
            req.flash("success_msg", "Se dio de baja una actividad en ganaderia correctamente");
            res.redirect("/ganaderiaActividades");
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al dar de baja una actividad en ganaderia");
            res.redirect("/ganaderiaActividades");
        });
};

module.exports = ganaderiaActividadesController;