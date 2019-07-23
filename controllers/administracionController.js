const Totales = require("./../utils/totales")
const Movimientos = require("./../utils/movimientos")
const models = require("../models");
const Administracion = models.Administracion;
const Caja = models.Caja;
const Banco = models.Banco;

var administracionController = {};

administracionController.list = function (req, res) {
  Administracion.findAll({
    where: {
      empresaId: res.locals.empresa.empresaId
    }
  }).then(administraciones => {
    administraciones.map(administracion => {
      var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(administracion.fechaCompra);
      antiguedad = Math.trunc(antiguedad / (1000 * 60 * 60 * 24 * 365))
      var valorMercado = administracion.cantidad * administracion.valorUnitario;
      var valorResidualMonto = administracion.cantidad * administracion.valorUnitario * administracion.valorResidual / 100;
      var amortizacion = (valorMercado - valorResidualMonto) / administracion.vidaUtil
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

      administracion.dataValues.valorMercado = valorMercado.toFixed(2);
      administracion.dataValues.antiguedad = antiguedad;
      administracion.dataValues.amortizacion = amortizacion.toFixed(2);
      administracion.dataValues.amortizacionAcumulada = amortizacionAcumulada.toFixed(2);
      administracion.dataValues.valorResidualMonto = valorResidualMonto.toFixed(2);
      administracion.dataValues.valorANuevo = valorANuevo.toFixed(2);
    });
    res.render("capital/administracion/administracion-list", {
      administraciones: administraciones,
      valorTotal: Totales.valorInfraestructuras(administraciones)
    });
  });
};

administracionController.add = function (req, res) {
  reqMC = req.body.movimientoCompra
  Administracion.create(req.body.administracion).then(administracion => {
      if (req.body.tipoAlta == 'compra') {
        reqMC.forEach(async mc => {
          await Movimientos.compra(administracion.fechaCompra, mc.monto, 'Administracion', administracion.administracionId, mc.cuenta, mc.cuentaId, administracion.empresaId)
        });
      }
      req.flash("success_msg", "Se dio de alta concepto de administracion correctamente");
      res.redirect("/administraciones");
    })
    .catch(error => {
      req.flash("error_msg", "Error al dar de alta concepto de administracion");
      res.redirect("/administraciones");
    });
};

administracionController.saveEdit = function (req, res) {
  reqMC = req.body.movimientoCompra
  Administracion.findByPk(req.params.id).then(administracion => {
    administracion
      .update(req.body.administracion)
      .then(() => {
        if (req.body.tipoAlta == 'compra') {
          Movimientos.deshacerCompra('Administracion', req.params.id)
          reqMC.forEach(mc => {
            Movimientos.compra(administracion.fechaCompra, mc.monto,'Administracion', administracion.administracionId, mc.cuenta , mc.cuentaId, administracion.empresaId) 
          });
        }
        req.flash("success_msg", "Se actualizó concepto de administracion correctamente");
        res.redirect("/administraciones");
      })
      .catch(err => {
        req.flash("error_msg", "Error al actualizar concepto de administracion");
        res.redirect("/administraciones");
      });
  });
};

administracionController.delete = function (req, res) {
  Administracion.destroy({
      where: {
        administracionId: req.params.id
      }
    }).then(async () => {
      await Movimientos.deshacerCompra('Administracion', req.params.id)
      req.flash("success_msg", "Se dio de baja concepto de administracion correctamente");
      res.redirect("/administraciones");
    })
    .catch(err => {
      req.flash("error_msg", "Error al dar de baja concepto de administracion");
      res.redirect("/administraciones");
    });
};

administracionController.liquidar = function (req, res) {
  var reqAdministracion = req.body.administracion
  var reqMovimiento = req.body.movimiento
  
  if (reqMovimiento.cuenta == 'Caja') {
    Caja.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(async caja => {
      
      await Movimientos.venta(reqAdministracion.fechaVenta, reqMovimiento.monto, 'Administracion', req.params.id, reqMovimiento.cuenta, caja.cajaId, res.locals.empresa.empresaId)
      
      Administracion.update(reqAdministracion, {
        where: {
          administracionId: req.params.id
        }
      }).then(() => {
        req.flash("success_msg", "Se liquidó concepto de administracion correctamente");
        res.redirect("/administraciones");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al liquidar concepto de administracion");
        res.redirect("/administraciones");
      });
      
    })
  }
  
  if (reqMovimiento.cuenta == 'Banco') {
    Banco.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(async banco => {
      
      await Movimientos.venta(reqAdministracion.fechaVenta, reqMovimiento.monto, 'Administracion', req.params.id, reqMovimiento.cuenta, banco.bancoId, res.locals.empresa.empresaId)
      
      Administracion.update(reqAdministracion, {
        where: {
          administracionId: req.params.id
        }
      }).then(() => {
        req.flash("success_msg", "Se liquidó concepto de administracion correctamente");
        res.redirect("/administraciones");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al liquidar concepto de administracion");
        res.redirect("/administraciones");
      });
    })
  }

};


administracionController.deshacerLiquidar = function (req, res) {
  Administracion.update({
    fechaVenta: null
  }, {
    where: {
      InfraestructuraId: req.params.id
    }
  }).then(async () => {
    await Movimientos.deshacerVenta('Administracion', req.params.id)
    req.flash("success_msg", "Se deshizo la liquidación de concepto de administracion correctamente");
    res.redirect("/administraciones");
  })
  .catch(err => {
    console.log(err)
    req.flash("error_msg", "Error al deshacer liquidación de concepto de admnistracion");
    res.redirect("/administraciones");
  });
};


module.exports = administracionController;