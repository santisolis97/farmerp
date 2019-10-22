const Totales = require("./../utils/totales")
const models = require("../models");
const Pradera = models.Pradera;

var praderaController = {};

praderaController.list = function (req, res) {
    Pradera.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(praderas => {
        praderas.map(pradera => {
            var valorMercado = pradera.valorHectarea * pradera.hectareas;
            var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(pradera.fechaImplantacion);
            antiguedad = Math.trunc(antiguedad / (1000 * 60 * 60 * 24 * 365))
            var valorResidualMonto = pradera.valorHectarea * pradera.hectareas * pradera.valorResidual / 100;
            var amortizacion = (pradera.valorHectarea * pradera.hectareas - valorResidualMonto) / pradera.vidaUtil
            var amortizacionAcumulada;
            var valorANuevo;

            if (amortizacion * antiguedad >= pradera.valorHectarea * pradera.hectareas) {
                amortizacionAcumulada = pradera.valorHectarea * pradera.hectareas
            } else {
                amortizacionAcumulada = amortizacion * antiguedad
            }

            if (pradera.valorHectarea * pradera.hectareas - amortizacionAcumulada <= 0) {
                valorANuevo = pradera.valorHectarea * pradera.hectareas
            } else {
                valorANuevo = pradera.valorHectarea * pradera.hectareas - amortizacionAcumulada
            }

            pradera.dataValues.antiguedad = antiguedad;
            pradera.dataValues.amortizacion = amortizacion.toFixed(2);
            pradera.dataValues.amortizacionAcumulada = amortizacionAcumulada.toFixed(2);
            pradera.dataValues.valorResidualMonto = valorResidualMonto.toFixed(2);
            pradera.dataValues.valorANuevo = valorANuevo.toFixed(2);
            pradera.dataValues.valorMercado = valorMercado.toFixed(2);
        });
        
        res.render("capital/pradera/pradera-list", {
            praderas: praderas,
            valorTotal: Totales.valorPraderas(praderas)
        });
    });
};

praderaController.add = function (req, res) {
    Pradera.create(req.body.pradera).then(pradera => {
            req.flash("success_msg", "Se dio de alta una pradera correctamente");
            res.redirect("/praderas");
        })
        .catch(error => {
            console.log(error)
            req.flash("error_msg", "Error al dar de alta una pradera");
            res.redirect("/praderas");
        });
};

praderaController.saveEdit = function (req, res) {
    Pradera.findByPk(req.params.id).then(pradera => {
        pradera
            .update(req.body.pradera)
            .then(async () => {
                req.flash("success_msg", "Se actualizó una pradera correctamente");
                res.redirect("/praderas");
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar una pradera");
                res.redirect("/praderas");
            });
    });
};

praderaController.delete = function (req, res) {
    Pradera.destroy({
            where: {
                praderaId: req.params.id
            }
        }).then(async () => {
            req.flash("success_msg", "Se dio de baja una pradera correctamente");
            res.redirect("/praderas");
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al dar de baja una pradera");
            res.redirect("/praderas");
        });
};

module.exports = praderaController;