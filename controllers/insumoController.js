const Totales = require("../utils/totales")
const models = require("../models");
const Insumo = models.Insumo;

var insumoController = {};

insumoController.list = function (req, res) {
    Insumo.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(insumos => {
        insumos.map(insumo => {
            var valorMercado = insumo.cantidad * insumo.valorUnitario;
            insumo.dataValues.valorMercado = valorMercado.toFixed(2);
        });
        
        res.render("capital/insumo/insumo-list", {
            insumos: insumos,
            valorTotal: Totales.valorInsumos(insumos)
        });
    });
};

insumoController.add = function (req, res) {
    Insumo.create(req.body.insumo).then(insumo => {
            req.flash("success_msg", "Se dio de alta un insumo correctamente");
            res.redirect("/insumos");
        })
        .catch(error => {
            console.log(error)
            req.flash("error_msg", "Error al dar de alta un insumo");
            res.redirect("/insumos");
        });
};

insumoController.saveEdit = function (req, res) {
    Insumo.findByPk(req.params.id).then(insumo => {
        insumo
            .update(req.body.insumo)
            .then(async () => {
                req.flash("success_msg", "Se actualizó un insumo correctamente");
                res.redirect("/insumos");
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar un insumo");
                res.redirect("/insumos");
            });
    });
};

insumoController.delete = function (req, res) {
    Insumo.destroy({
            where: {
                insumoId: req.params.id
            }
        }).then(async () => {
            req.flash("success_msg", "Se dio de baja un insumo correctamente");
            res.redirect("/insumos");
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al dar de baja un insumo");
            res.redirect("/insumos");
        });
};

module.exports = insumoController;