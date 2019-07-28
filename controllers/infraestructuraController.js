const Totales = require("./../utils/totales")
const Movimientos = require("./../utils/movimientos")
const models = require("../models");
const Infraestructura = models.Infraestructura;
const Caja = models.Caja;
const Banco = models.Banco;

var infraestructuraController = {};

infraestructuraController.list = function (req, res) {
  Infraestructura.findAll({
    where: {
      empresaId: res.locals.empresa.empresaId
    }
  }).then(infraestructuras => {
    infraestructuras.map(infraestructura => {
      var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(infraestructura.fechaCompra);
      antiguedad = Math.trunc(antiguedad / (1000 * 60 * 60 * 24 * 365))
      var valorMercado = infraestructura.cantidad * infraestructura.valorUnitario;
      var valorResidualMonto = infraestructura.cantidad * infraestructura.valorUnitario * infraestructura.valorResidual / 100;
      var amortizacion = (valorMercado - valorResidualMonto) / infraestructura.vidaUtil
      var amortizacionAcumulada;
      var valorANuevo;

      if (amortizacion * antiguedad >= valorMercado) {
        amortizacionAcumulada = valorMercado
      } else {
        amortizacionAcumulada = amortizacion * antiguedad
      }

      if (valorMercado - amortizacionAcumulada <= 0) {
        valorANuevo = valorMercado
      } else {
        valorANuevo = valorMercado - amortizacionAcumulada
      }

      infraestructura.dataValues.valorMercado = valorMercado.toFixed(2);
      infraestructura.dataValues.antiguedad = antiguedad;
      infraestructura.dataValues.amortizacion = amortizacion.toFixed(2);
      infraestructura.dataValues.amortizacionAcumulada = amortizacionAcumulada.toFixed(2);
      infraestructura.dataValues.valorResidualMonto = valorResidualMonto.toFixed(2);
      infraestructura.dataValues.valorANuevo = valorANuevo.toFixed(2);
    });
    res.render("capital/infraestructura/infraestructura-list", {
      infraestructuras: infraestructuras,
      valorTotal: Totales.valorInfraestructuras(infraestructuras)
    });
  });
};

infraestructuraController.add = function (req, res) {
  reqMC = req.body.movimientoCompra
  Infraestructura.create(req.body.infraestructura).then(infraestructura => {
      if (req.body.tipoAlta == 'compra') {
        reqMC.forEach(async mc => {
          await Movimientos.compra(infraestructura.fechaCompra, mc.monto, 'Infraestructura', infraestructura.infraestructuraId, mc.cuenta, mc.cuentaId, infraestructura.empresaId)
        });
      }
      req.flash("success_msg", "Se dio de alta infraestructura correctamente");
      res.redirect("/infraestructuras");
    })
    .catch(error => {
      req.flash("error_msg", "Error al dar de alta infraestructura");
      res.redirect("/infraestructuras");
    });
};

infraestructuraController.saveEdit = function (req, res) {
  reqMC = req.body.movimientoCompra
  Infraestructura.findByPk(req.params.id).then(infraestructura => {
    infraestructura
      .update(req.body.infraestructura)
      .then(async () => {
        if (req.body.tipoAlta == 'compra') {
          await Movimientos.deshacerCompra('Infraestructura', req.params.id)
          reqMC.forEach(mc => {
            Movimientos.compra(infraestructura.fechaCompra, mc.monto,'Infraestructura', infraestructura.infraestructuraId, mc.cuenta , mc.cuentaId, infraestructura.empresaId) 
          });
        }
        req.flash("success_msg", "Se actualizó infraestructura correctamente");
        res.redirect("/infraestructuras");
      })
      .catch(err => {
        req.flash("error_msg", "Error al actualizar infraestructura");
        res.redirect("/infraestructuras");
      });
  });
};

infraestructuraController.delete = function (req, res) {
  Infraestructura.destroy({
      where: {
        infraestructuraId: req.params.id
      }
    }).then(async () => {
      await Movimientos.deshacerCompra('Infraestructura', req.params.id)
      req.flash("success_msg", "Se dio de baja infraestructura correctamente");
      res.redirect("/infraestructuras");
    })
    .catch(err => {
      req.flash("error_msg", "Error al dar de baja infraestructura");
      res.redirect("/infraestructuras");
    });
};

infraestructuraController.liquidar = function (req, res) {
  var reqInfraestructura = req.body.infraestructura
  var reqMovimiento = req.body.movimiento
  
  if (reqMovimiento.cuenta == 'Caja') {
    Caja.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(async caja => {
      
      await Movimientos.venta(reqInfraestructura.fechaVenta, reqMovimiento.monto, 'Infraestructura', req.params.id, reqMovimiento.cuenta, caja.cajaId, res.locals.empresa.empresaId)
      
      Infraestructura.update(reqInfraestructura, {
        where: {
          infraestructuraId: req.params.id
        }
      }).then(() => {
        req.flash("success_msg", "Se liquidó infraestructura correctamente");
        res.redirect("/infraestructuras");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al liquidar infraestructura");
        res.redirect("/infraestructuras");
      });
      
    })
  }
  
  if (reqMovimiento.cuenta == 'Banco') {
    Banco.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(async banco => {
      
      await Movimientos.venta(reqInfraestructura.fechaVenta, reqMovimiento.monto, 'Infraestructura', req.params.id, reqMovimiento.cuenta, banco.bancoId, res.locals.empresa.empresaId)
      
      Infraestructura.update(reqInfraestructura, {
        where: {
          infraestructuraId: req.params.id
        }
      }).then(() => {
        req.flash("success_msg", "Se liquidó infraestructura correctamente");
        res.redirect("/infraestructuras");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al liquidar infraestructura");
        res.redirect("/infraestructuras");
      });
    })
  }

};


infraestructuraController.deshacerLiquidar = function (req, res) {
  Infraestructura.update({
    fechaVenta: null
  }, {
    where: {
      InfraestructuraId: req.params.id
    }
  }).then(async () => {
    await Movimientos.deshacerVenta('Infraestructura', req.params.id)
    req.flash("success_msg", "Se deshizo la liquidación de infraestructura correctamente");
    res.redirect("/infraestructuras");
  })
  .catch(err => {
    console.log(err)
    req.flash("error_msg", "Error al deshacer liquidación de infraestructura");
    res.redirect("/infraestructuras");
  });
};


module.exports = infraestructuraController;