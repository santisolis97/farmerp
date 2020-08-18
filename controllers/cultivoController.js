const models = require("./../models");
const Cultivo = models.Cultivo;

var cultivoController = {};

cultivoController.list = function (req, res) {
    Cultivo.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(cultivos => {
        res.render("agricultura/cultivo/cultivo-list", {
            cultivos
        })
    })
};

cultivoController.add = function (req, res) {
    var reqCultivo = req.body.cultivo
    Cultivo.create(reqCultivo).then(cultivo => {
            req.flash("success_msg", "Se dio de alta un Cultivo");
            res.redirect("/cultivos");
        })
        .catch(error => {
            console.log(error)
            req.flash("error_msg", "Error al dar de alta un Cultivo");
            res.redirect("/cultivos");
        });
};

cultivoController.saveEdit = function (req, res) {
    var reqCultivo = req.body.cultivo

    Cultivo.findByPk(req.params.id).then(cultivo => {
        cultivo
            .update(reqCultivo)
            .then(c => {
                req.flash("success_msg", "Se actualizó un Cultivo correctamente");
                res.redirect("/cultivos");
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar un Cultivo");
                res.redirect("/cultivos");
            });
    });
};

cultivoController.delete = function (req, res) {
    Cultivo.destroy({
            where: {
                cultivoId: req.params.id
            }
        }).then(() => {
            req.flash("success_msg", "Se dio de baja un Cultivo correctamente");
            res.redirect("/cultivos");
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al dar de baja un Cultivo");
            res.redirect("/cultivos");
        });
};

module.exports = cultivoController;