const models = require("./../models");
const Cultivo = models.Cultivo;
const Rubro = models.Rubro;
const Concepto = models.Concepto

var CultivoController = {};

CultivoController.list = function (req, res) {
    Cultivo.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(cultivos => {
        Rubro.findAll({
            where: {
                empresaId: res.locals.empresa.empresaId
            }
        }).then(rubros => {
            Concepto.findAll({
                where: {
                    empresaId: res.locals.empresa.empresaId
                }
            }).then(conceptos=>{
                res.render("agricultura/datosBase/datosBase", {
                    rubros,cultivos,conceptos
                })
            })       
        });
    });
};

CultivoController.add = function (req, res) {
    var reqCultivo = req.body.cultivo
    Cultivo.create(reqCultivo).then(cultivo => {
            req.flash("success_msg", "Se dio de alta un Cultivo");
            res.redirect("/agriculturaDatosBase");
        })
        .catch(error => {
            console.log(error)
            req.flash("error_msg", "Error al dar de alta un Cultivo");
            res.redirect("/agriculturaDatosBase");
        });
};

CultivoController.addRubro = function (req, res) {
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

CultivoController.addConcepto = function (req, res) {
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


CultivoController.saveEdit = function (req, res) {
    var reqCultivo = req.body.cultivo

    Cultivo.findByPk(req.params.id).then(cultivo => {
        cultivo
            .update(reqCultivo)
            .then(c => {
                req.flash("success_msg", "Se actualizó un Cultivo correctamente");
                res.redirect("/agriculturaDatosBase");
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar un Cultivo");
                res.redirect("/agriculturaDatosBase");
            });
    });
};

CultivoController.saveEditRubro = function (req, res) {
 
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

CultivoController.saveEditConcepto = function (req, res) {
 
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

CultivoController.delete = function (req, res) {
    Cultivo.destroy({
            where: {
                cultivoId: req.params.id
            }
        }).then(() => {
            req.flash("success_msg", "Se dio de baja un Cultivo correctamente");
            res.redirect("/agriculturaDatosBase");
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al dar de baja un Cultivo");
            res.redirect("/agriculturaDatosBase");
        });
};
CultivoController.deleteRubro = function (req, res) {
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
CultivoController.deleteConcepto = function (req, res) {
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

module.exports = CultivoController;