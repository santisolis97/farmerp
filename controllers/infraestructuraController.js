const Totales = require("./../utils/totales")
const models = require("../models");
const Infraestructura = models.Infraestructura;

var infraestructuraController = {};

infraestructuraController.list = function (req, res) {
  var valorTotal = 0
  Infraestructura.findAll({
    where: {
      empresaId: res.locals.empresa.empresaId
    }
  }).then(infraestructuras => {
    infraestructuras.map(infraestructura => {
      var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(infraestructura.fechaCompra);
      antiguedad = Math.trunc(antiguedad / (1000*60*60*24*365))
      var valorMercado =  infraestructura.cantidad * infraestructura.valorUnitario;
      var valorResidualMonto = infraestructura.cantidad * infraestructura.valorUnitario * infraestructura.valorResidual / 100;
      var amortizacion = (valorMercado - valorResidualMonto)/infraestructura.vidaUtil
      var amortizacionAcumulada;
      var valorANuevo;
      
      if (amortizacion * antiguedad >= valorMercado){
        amortizacionAcumulada = valorMercado
      } else {
        amortizacionAcumulada = amortizacion * antiguedad
      }
      
      if (valorMercado - amortizacionAcumulada <= 0){
        valorANuevo = valorMercado
      } else {
        valorANuevo = valorMercado - amortizacionAcumulada
      }

      infraestructura.dataValues.valorMercado = valorMercado;
      infraestructura.dataValues.antiguedad = antiguedad;
      infraestructura.dataValues.amortizacion = amortizacion;
      infraestructura.dataValues.amortizacionAcumulada = amortizacionAcumulada;
      infraestructura.dataValues.valorResidualMonto = valorResidualMonto;
      infraestructura.dataValues.valorANuevo = valorANuevo;
    });
    res.render("capital/infraestructura/infraestructura-list", {
      infraestructuras: infraestructuras,
      valorTotal: Totales.valorInfraestructuras(infraestructuras)
    });
  });
};

infraestructuraController.add = function (req, res) {
  Infraestructura.create(req.body.infraestructura).then(infraestructura => {
      req.flash("success_msg", "Se dio de alta una infraestructura correctamente");
      res.redirect("/infraestructuras");
    })
    .catch(error => {
      req.flash("error_msg", "Error al dar de alta una infraestructura");
      res.redirect("/infraestructuras");
    });
};

infraestructuraController.saveEdit = function (req, res) {
  Infraestructura.findByPk(req.params.id).then(infraestructura => {
    infraestructura
      .update(req.body.infraestructura)
      .then(() => {
        req.flash("success_msg", "Se actualizó una infraestructura correctamente");
        res.redirect("/infraestructuras");
      })
      .catch(err => {
        req.flash("error_msg", "Error al actualizar una infraestructura");
        res.redirect("/infraestructuras");
      });
  });
};

infraestructuraController.delete = function (req, res) {
  Infraestructura.destroy({
      where: {
        loteId: req.params.id
      }
    }).then(() => {
      req.flash("success_msg", "Se dio de baja una infraestructura correctamente");
      res.redirect("/infraestructuras");
    })
    .catch(err => {
      req.flash("error_msg", "Error al dar de baja una infraestructura");
      res.redirect("/infraestructuras");
    });
};

module.exports = infraestructuraController;