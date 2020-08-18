const models = require("./../models");
const Rubro = models.Rubro;
const Concepto = models.Concepto

var datosBaseController = {};

datosBaseController.list = function (req, res) {

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
            res.render("agricultura/datosBase/datosBase", {
                rubros,
                conceptos
            })
        })
    });
};

datosBaseController.addRubro = function (req, res) {
    var reqRubro = req.body.rubro
    Rubro.create(reqRubro).then(rubro => {
            req.flash("success_msg", "Se dio de alta un Rubro");
            res.redirect("/agriculturaDatosBase");
        })
        .catch(error => {
            console.log(error)
            req.flash("error_msg", "Error al dar de alta un Rubro");
            res.redirect("/agriculturaDatosBase");
        });
};

datosBaseController.addConcepto = function (req, res) {
    var reqConcepto = req.body.concepto
    Concepto.create(reqConcepto).then(concepto => {
            req.flash("success_msg", "Se dio de alta un Concepto");
            res.redirect("/agriculturaDatosBase");
        })
        .catch(error => {
            console.log(error)
            req.flash("error_msg", "Error al dar de alta un Concepto");
            res.redirect("/agriculturaDatosBase");
        });
};


datosBaseController.saveEditRubro = function (req, res) {

    var reqRubro = req.body.rubro

    Rubro.findByPk(req.params.id).then(rubro => {
        rubro
            .update(reqRubro)
            .then(c => {
                req.flash("success_msg", "Se actualizó un Rubro correctamente");
                res.redirect("/agriculturaDatosBase");
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar un Rubro");
                res.redirect("/agriculturaDatosBase");
            });
    });
};

datosBaseController.saveEditConcepto = function (req, res) {

    var reqConcepto = req.body.concepto

    Concepto.findByPk(req.params.id).then(concepto => {
        concepto
            .update(reqConcepto)
            .then(c => {
                req.flash("success_msg", "Se actualizó un Concepto correctamente");
                res.redirect("/agriculturaDatosBase");
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar un Concepto");
                res.redirect("/agriculturaDatosBase");
            });
    });
};

datosBaseController.deleteRubro = function (req, res) {
    Rubro.destroy({
            where: {
                rubroId: req.params.id
            }
        }).then(() => {
            req.flash("success_msg", "Se dio de baja un Rubro correctamente");
            res.redirect("/agriculturaDatosBase");
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al dar de baja un Rubro");
            res.redirect("/agriculturaDatosBase");
        });
};

datosBaseController.deleteConcepto = function (req, res) {
    Concepto.destroy({
            where: {
                conceptoId: req.params.id
            }
        }).then(() => {
            req.flash("success_msg", "Se dio de baja un Concepto correctamente");
            res.redirect("/agriculturaDatosBase");
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al dar de baja un Concepto");
            res.redirect("/agriculturaDatosBase");
        });
};

module.exports = datosBaseController;