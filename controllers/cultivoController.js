const models = require("./../models");
const Cultivo = models.Cultivo;

var CultivoController = {};

CultivoController.list = function (req, res) {
    Cultivo.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(cultivos => {
        res.render("agricultura/datosBase/datosBase", {
            cultivos
        })
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

module.exports = CultivoController;