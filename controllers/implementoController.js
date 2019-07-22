const Totales = require("./../utils/totales")
const Movimientos = require("./../utils/movimientos")
const models = require("../models");
const Implemento = models.Implemento;
const Caja = models.Caja;
const Banco = models.Banco;

var implementoController = {};

implementoController.list = function (req, res) {
  Implemento.findAll({
    where: {
      empresaId: res.locals.empresa.empresaId
    }
  }).then(implementos => {
    implementos.map(implemento => {
      var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(implemento.fechaCompra);
      antiguedad = Math.trunc(antiguedad / (1000*60*60*24*365))
      var valorResidualMonto = implemento.valorUnitario * implemento.valorResidual / 100;
      var amortizacion = (implemento.valorUnitario - valorResidualMonto)/implemento.vidaUtil
      var amortizacionAcumulada;
      var valorANuevo;
      
      if (amortizacion * antiguedad >= implemento.valorUnitario){
        amortizacionAcumulada = implemento.valorUnitario
      } else {
        amortizacionAcumulada = amortizacion * antiguedad
      }
      
      if (implemento.valorUnitario - amortizacionAcumulada <= 0){
        valorANuevo = implemento.valorUnitario
      } else {
        valorANuevo = implemento.valorUnitario - amortizacionAcumulada
      }

      implemento.dataValues.antiguedad = antiguedad;
      implemento.dataValues.amortizacion = amortizacion.toFixed(2);
      implemento.dataValues.amortizacionAcumulada = amortizacionAcumulada.toFixed(2);
      implemento.dataValues.valorResidualMonto = valorResidualMonto.toFixed(2);
      implemento.dataValues.valorANuevo = valorANuevo.toFixed(2);
    });
    res.render("capital/implemento/implemento-list", {
      implementos: implementos,
      valorTotal: Totales.valorImplementos(implementos)
    });
  });
};

implementoController.add = function (req, res) {
  reqMC = req.body.movimientoCompra
  Implemento.create(req.body.implemento).then(implemento => {
    if (req.body.tipoAlta == 'compra') {
      reqMC.forEach(async mc => {
        await Movimientos.compra(implemento.fechaCompra, mc.monto, 'Implemento', implemento.implementoId, mc.cuenta, mc.cuentaId, implemento.empresaId)
      });
    }
      req.flash("success_msg", "Se dio de alta un implemento correctamente");
      res.redirect("/implementos");
    })
    .catch(error => {
      console.log(error)
      req.flash("error_msg", "Error al dar de alta un implemento");
      res.redirect("/implementos");
    });
};

implementoController.saveEdit = function (req, res) {
  reqMC = req.body.movimientoCompra
  Implemento.findByPk(req.params.id).then(implemento => {
    implemento
      .update(req.body.implemento)
      .then(() => {
        if (req.body.tipoAlta == 'compra') {
          Movimientos.deshacerCompra('Implemento', req.params.id)
          reqMC.forEach(mc => {
            Movimientos.compra(implemento.fechaCompra, mc.monto,'Implemento', implemento.implementoId, mc.cuenta , mc.cuentaId, implemento.empresaId) 
          });
        }
        req.flash("success_msg", "Se actualizó un implemento correctamente");
        res.redirect("/implementos");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al actualizar un implemento");
        res.redirect("/implementos");
      });
  });
};

implementoController.delete = function (req, res) {
  Implemento.destroy({
      where: {
        implementoId: req.params.id
      }
    }).then(async () => {
      await Movimientos.deshacerCompra('Implemento', req.params.id)
      req.flash("success_msg", "Se dio de baja un implemento correctamente");
      res.redirect("/implementos");
    })
    .catch(err => {
      console.log(err)
      req.flash("error_msg", "Error al dar de baja un implemento");
      res.redirect("/implementos");
    });
};

implementoController.liquidar = function (req, res) {
  var reqImplemento = req.body.implemento
  var reqMovimiento = req.body.movimiento
  
  if (reqMovimiento.cuenta == 'Caja') {
    Caja.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(async caja => {
      
      await Movimientos.venta(reqImplemento.fechaVenta, reqMovimiento.monto, 'Implemento', req.params.id, reqMovimiento.cuenta, caja.cajaId, res.locals.empresa.empresaId)
      
      Implemento.update(reqImplemento, {
        where: {
          implementoId: req.params.id
        }
      }).then(() => {
        req.flash("success_msg", "Se liquidó implemento correctamente");
        res.redirect("/implementos");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al liquidar implemento");
        res.redirect("/implementos");
      });
      
    })
  }
  
  if (reqMovimiento.cuenta == 'Banco') {
    Banco.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(async banco => {
      
      await Movimientos.venta(reqImplemento.fechaVenta, reqMovimiento.monto, 'Implemento', req.params.id, reqMovimiento.cuenta, banco.bancoId, res.locals.empresa.empresaId)
      
      Implemento.update(reqImplemento, {
        where: {
          implementoId: req.params.id
        }
      }).then(() => {
        req.flash("success_msg", "Se liquidó implemento correctamente");
        res.redirect("/implementos");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al liquidar implementos");
        res.redirect("/implementos");
      });
    })
  }

};


implementoController.deshacerLiquidar = function (req, res) {
  Implemento.update({
    fechaVenta: null
  }, {
    where: {
      implementoId: req.params.id
    }
  }).then(async () => {
    await Movimientos.deshacerVenta('Implemento', req.params.id)
    req.flash("success_msg", "Se deshizo la liquidación de implemento correctamente");
    res.redirect("/implementos");
  })
  .catch(err => {
    console.log(err)
    req.flash("error_msg", "Error al deshacer liquidación de implemento");
    res.redirect("/implementos");
  });
};


module.exports = implementoController;