const models = require("./../models");
const GanaderiaRubro = models.GanaderiaRubro;
const GanaderiaConcepto = models.GanaderiaConcepto

var ganaderiadatosBaseController = {};

ganaderiadatosBaseController.list = function (req, res) {

    GanaderiaRubro.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(ganaderiarubros => {
        GanaderiaConcepto.findAll({
            where: {
                empresaId: res.locals.empresa.empresaId
            }
        }).then(ganaderiaconceptos => {
            res.render("ganaderia/datosBase/datosBase", {
                ganaderiarubros,
                ganaderiaconceptos
            })
        })
    });
};

ganaderiadatosBaseController.addRubro = function (req, res) {
    var reqGanaderiaRubro = req.body.ganaderiarubro
    GanaderiaRubro.create(reqGanaderiaRubro).then(ganaderiarubro => {
            req.flash("success_msg", "Se dio de alta un Rubro en ganaderia");
            res.redirect("/ganaderiaDatosBase");
        })
        .catch(error => {
            console.log(error)
            req.flash("error_msg", "Error al dar de alta un Rubro");
            res.redirect("/ganaderiaDatosBase");
        });
};

ganaderiadatosBaseController.addConcepto = function (req, res) {
    var reqGanaderiaConcepto = req.body.ganaderiaconcepto
    GanaderiaConcepto.create(reqGanaderiaConcepto).then(ganaderiaconcepto => {
            req.flash("success_msg", "Se dio de alta un Concepto en ganaderia");
            res.redirect("/ganaderiaDatosBase");
        })
        .catch(error => {
            console.log(error)
            req.flash("error_msg", "Error al dar de alta un Concepto en ganaderia");
            res.redirect("/ganaderiaDatosBase");
        });
};


ganaderiadatosBaseController.saveEditRubro = function (req, res) {

    var reqGanaderiaRubro = req.body.ganaderiarubro

    GanaderiaRubro.findByPk(req.params.id).then(ganaderiarubro => {
        ganaderiarubro
            .update(reqGanaderiaRubro)
            .then(c => {
                req.flash("success_msg", "Se actualizó un Rubro correctamente en ganaderia");
                res.redirect("/ganaderiaDatosBase");
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar un Rubro en ganaderia");
                res.redirect("/ganaderiaDatosBase");
            });
    });
};

ganaderiadatosBaseController.saveEditConcepto = function (req, res) {

    var reqGanaderiaConcepto = req.body.ganaderiaconcepto

    GanaderiaConcepto.findByPk(req.params.id).then(ganaderiaconcepto => {
        ganaderiaconcepto
            .update(reqGanaderiaConcepto)
            .then(c => {
                req.flash("success_msg", "Se actualizó un Concepto correctamente en ganaderia");
                res.redirect("/ganaderiaDatosBase");
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar un Concepto en ganaderia");
                res.redirect("/ganaderiaDatosBase");
            });
    });
};

ganaderiadatosBaseController.deleteRubro = function (req, res) {
    GanaderiaRubro.destroy({
            where: {
                rubroId: req.params.id
            }
        }).then(() => {
            req.flash("success_msg", "Se dio de baja un Rubro correctamente en ganaderia");
            res.redirect("/ganaderiaDatosBase");
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al dar de baja un Rubro en ganaderia");
            res.redirect("/ganaderiaDatosBase");
        });
};

ganaderiadatosBaseController.deleteConcepto = function (req, res) {
    GanaderiaConcepto.destroy({
            where: {
                conceptoId: req.params.id
            }
        }).then(() => {
            req.flash("success_msg", "Se dio de baja un Concepto correctamente en ganaderia");
            res.redirect("/ganaderiaDatosBase");
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al dar de baja un Concepto en ganaderia");
            res.redirect("/ganaderiaDatosBase");
        });
};

module.exports = ganaderiadatosBaseController;