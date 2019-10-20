const models = require("./../models");
const TipoHacienda = models.TipoHacienda;

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
            req.flash("error_msg", "Error al dar de baja un Tipo de Hacienda");
            res.redirect("/tiposHacienda");
        });
};

module.exports = tipoHaciendaController;