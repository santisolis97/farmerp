const Totales = require("./../utils/totales")
const Movimientos = require("./../utils/movimientos")
const models = require("../models");
const Rodado = models.Rodado;
const Caja = models.Caja;
const Banco = models.Banco;

var rodadoController = {};

rodadoController.list = function (req, res) {
  Rodado.findAll({
    where: {
      empresaId: res.locals.empresa.empresaId
    }
  }).then(rodados => {
    rodados.map(rodado => {
      var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(rodado.fechaCompra);
      antiguedad = Math.trunc(antiguedad / (1000*60*60*24*365))
      var valorMercado =  rodado.cantidad * rodado.valorUnitario;
      var valorResidualMonto = rodado.cantidad * rodado.valorUnitario * rodado.valorResidual / 100;
      var amortizacion = (valorMercado - valorResidualMonto)/rodado.vidaUtil
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

      rodado.dataValues.valorMercado = valorMercado.toFixed(2);
      rodado.dataValues.antiguedad = antiguedad;
      rodado.dataValues.amortizacion = amortizacion.toFixed(2);
      rodado.dataValues.amortizacionAcumulada = amortizacionAcumulada.toFixed(2);
      rodado.dataValues.valorResidualMonto = valorResidualMonto.toFixed(2);
      rodado.dataValues.valorANuevo = valorANuevo.toFixed(2);
    });
    res.render("capital/rodado/rodado-list", {
      rodados: rodados,
      valorTotal: Totales.valorRodados(rodados)
    });
  });
};

rodadoController.add = function (req, res) {
  reqMC = req.body.movimientoCompra
  Rodado.create(req.body.rodado).then(rodado => {
    if (req.body.tipoAlta == 'compra') {
      reqMC.forEach(async mc => {
        await Movimientos.compra(rodado.fechaCompra, mc.monto, 'Rodado', rodado.rodadoId, mc.cuenta, mc.cuentaId, rodado.empresaId)
      });
    }
      req.flash("success_msg", "Se dio de alta un rodado correctamente");
      res.redirect("/rodados");
    })
    .catch(error => {
      console.log(error)
      req.flash("error_msg", "Error al dar de alta un rodado");
      res.redirect("/rodados");
    });
};

rodadoController.saveEdit = function (req, res) {
  reqMC = req.body.movimientoCompra
  Rodado.findByPk(req.params.id).then(rodado => {
    rodado
      .update(req.body.rodado)
      .then(() => {
        if (req.body.tipoAlta == 'compra') {
          Movimientos.deshacerCompra('Rodado', req.params.id)
          reqMC.forEach(mc => {
            Movimientos.compra(rodado.fechaCompra, mc.monto,'Rodado', rodado.rodadoId, mc.cuenta , mc.cuentaId, rodado.empresaId) 
          });
        }
        req.flash("success_msg", "Se actualizó un rodado correctamente");
        res.redirect("/rodados");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al actualizar un rodado");
        res.redirect("/rodados");
      });
  });
};

rodadoController.delete = function (req, res) {
  Rodado.destroy({
      where: {
        rodadoId: req.params.id
      }
    }).then(async () => {
      await Movimientos.deshacerCompra('Rodado', req.params.id)
      req.flash("success_msg", "Se dio de baja un rodado correctamente");
      res.redirect("/rodados");
    })
    .catch(err => {
      console.log(err)
      req.flash("error_msg", "Error al dar de baja un rodado");
      res.redirect("/rodados");
    });
};

rodadoController.liquidar = function (req, res) {
  var reqRodado = req.body.rodado
  var reqMovimiento = req.body.movimiento
  
  if (reqMovimiento.cuenta == 'Caja') {
    Caja.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(async caja => {
      
      await Movimientos.venta(reqRodado.fechaVenta, reqMovimiento.monto, 'Rodado', req.params.id, reqMovimiento.cuenta, caja.cajaId, res.locals.empresa.empresaId)
      
      Rodado.update(reqRodado, {
        where: {
          rodadoId: req.params.id
        }
      }).then(() => {
        req.flash("success_msg", "Se liquidó rodado correctamente");
        res.redirect("/rodados");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al liquidar rodado");
        res.redirect("/rodados");
      });
      
    })
  }
  
  if (reqMovimiento.cuenta == 'Banco') {
    Banco.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(async banco => {
      
      await Movimientos.venta(reqRodado.fechaVenta, reqMovimiento.monto, 'Rodado', req.params.id, reqMovimiento.cuenta, banco.bancoId, res.locals.empresa.empresaId)
      
      Rodado.update(reqRodado, {
        where: {
          rodadoId: req.params.id
        }
      }).then(() => {
        req.flash("success_msg", "Se liquidó rodado correctamente");
        res.redirect("/rodados");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al liquidar rodados");
        res.redirect("/rodados");
      });
    })
  }

};


rodadoController.deshacerLiquidar = function (req, res) {
  Rodado.update({
    fechaVenta: null
  }, {
    where: {
      rodadoId: req.params.id
    }
  }).then(async () => {
    await Movimientos.deshacerVenta('Rodado', req.params.id)
    req.flash("success_msg", "Se deshizo la liquidación de rodado correctamente");
    res.redirect("/rodados");
  })
  .catch(err => {
    console.log(err)
    req.flash("error_msg", "Error al deshacer liquidación de rodado");
    res.redirect("/rodados");
  });
};


module.exports = rodadoController;