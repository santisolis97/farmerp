const Totales = require("./../utils/totales")
const Movimientos = require("./../utils/movimientos")
const models = require("../models");
const Tractor = models.Tractor;
const Caja = models.Caja;
const Banco = models.Banco;

var tractorController = {};

tractorController.list = function (req, res) {
  Tractor.findAll({
    where: {
      empresaId: res.locals.empresa.empresaId
    }
  }).then(tractores => {
    tractores.map(tractor => {
      var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(tractor.fechaCompra);
      antiguedad = Math.trunc(antiguedad / (1000*60*60*24*365))
      var valorResidualMonto = tractor.valorUnitario * tractor.valorResidual / 100;
      var amortizacion = (tractor.valorUnitario - valorResidualMonto)/tractor.vidaUtil
      var amortizacionAcumulada;
      var valorANuevo;
      
      if (amortizacion * antiguedad >= tractor.valorUnitario){
        amortizacionAcumulada = tractor.valorUnitario
      } else {
        amortizacionAcumulada = amortizacion * antiguedad
      }
      
      if (tractor.valorUnitario - amortizacionAcumulada <= 0){
        valorANuevo = tractor.valorUnitario
      } else {
        valorANuevo = tractor.valorUnitario - amortizacionAcumulada
      }

      tractor.dataValues.antiguedad = antiguedad;
      tractor.dataValues.amortizacion = amortizacion.toFixed(2);
      tractor.dataValues.amortizacionAcumulada = amortizacionAcumulada.toFixed(2);
      tractor.dataValues.valorResidualMonto = valorResidualMonto.toFixed(2);
      tractor.dataValues.valorANuevo = valorANuevo.toFixed(2);
    });
    res.render("capital/tractor/tractor-list", {
      tractores: tractores,
      valorTotal: Totales.valorTractores(tractores)
    });
  });
};

tractorController.add = function (req, res) {
  reqMC = req.body.movimientoCompra
  Tractor.create(req.body.tractor).then(tractor => {
    if (req.body.tipoAlta == 'compra') {
      reqMC.forEach(async mc => {
        await Movimientos.compra(tractor.fechaCompra, mc.monto, 'Tractor', tractor.tractorId, mc.cuenta, mc.cuentaId, tractor.empresaId)
      });
    }
      req.flash("success_msg", "Se dio de alta un tractor correctamente");
      res.redirect("/tractores");
    })
    .catch(error => {
      console.log(error)
      req.flash("error_msg", "Error al dar de alta un tractor");
      res.redirect("/tractores");
    });
};

tractorController.saveEdit = function (req, res) {
  reqMC = req.body.movimientoCompra
  Tractor.findByPk(req.params.id).then(tractor => {
    tractor
      .update(req.body.tractor)
      .then(() => {
        if (req.body.tipoAlta == 'compra') {
          Movimientos.deshacerCompra('Tractor', req.params.id)
          reqMC.forEach(mc => {
            Movimientos.compra(tractor.fechaCompra, mc.monto,'Tractor', tractor.tractorId, mc.cuenta , mc.cuentaId, tractor.empresaId) 
          });
        }
        req.flash("success_msg", "Se actualizó un tractor correctamente");
        res.redirect("/tractores");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al actualizar un tractor");
        res.redirect("/tractores");
      });
  });
};

tractorController.delete = function (req, res) {
  Tractor.destroy({
      where: {
        tractorId: req.params.id
      }
    }).then(async () => {
      await Movimientos.deshacerCompra('Tractor', req.params.id)
      req.flash("success_msg", "Se dio de baja un tractor correctamente");
      res.redirect("/tractores");
    })
    .catch(err => {
      console.log(err)
      req.flash("error_msg", "Error al dar de baja un tractor");
      res.redirect("/tractores");
    });
};

tractorController.liquidar = function (req, res) {
  var reqTractor = req.body.tractor
  var reqMovimiento = req.body.movimiento
  
  if (reqMovimiento.cuenta == 'Caja') {
    Caja.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(async caja => {
      
      await Movimientos.venta(reqTractor.fechaVenta, reqMovimiento.monto, 'Tractor', req.params.id, reqMovimiento.cuenta, caja.cajaId, res.locals.empresa.empresaId)
      
      Tractor.update(reqTractor, {
        where: {
          tractorId: req.params.id
        }
      }).then(() => {
        req.flash("success_msg", "Se liquidó tractor correctamente");
        res.redirect("/tractores");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al liquidar tractor");
        res.redirect("/tractores");
      });
      
    })
  }
  
  if (reqMovimiento.cuenta == 'Banco') {
    Banco.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(async banco => {
      
      await Movimientos.venta(reqTractor.fechaVenta, reqMovimiento.monto, 'Tractor', req.params.id, reqMovimiento.cuenta, banco.bancoId, res.locals.empresa.empresaId)
      
      Tractor.update(reqTractor, {
        where: {
          tractorId: req.params.id
        }
      }).then(() => {
        req.flash("success_msg", "Se liquidó tractor correctamente");
        res.redirect("/tractores");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al liquidar tractores");
        res.redirect("/tractores");
      });
    })
  }

};


tractorController.deshacerLiquidar = function (req, res) {
  Tractor.update({
    fechaVenta: null
  }, {
    where: {
      tractorId: req.params.id
    }
  }).then(async () => {
    await Movimientos.deshacerVenta('Tractor', req.params.id)
    req.flash("success_msg", "Se deshizo la liquidación de tractor correctamente");
    res.redirect("/tractores");
  })
  .catch(err => {
    console.log(err)
    req.flash("error_msg", "Error al deshacer liquidación de tractor");
    res.redirect("/tractores");
  });
};


module.exports = tractorController;