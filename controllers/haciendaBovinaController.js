const Totales = require("./../utils/totales")
const Movimientos = require("./../utils/movimientos")
const models = require("../models");
const HaciendaBovina = models.HaciendaBovina;
const Caja = models.Caja;
const Banco = models.Banco;

var haciendaBovinaController = {};

haciendaBovinaController.list = function (req, res) {
  HaciendaBovina.findAll({
    where: {
      empresaId: res.locals.empresa.empresaId
    }
  }).then(haciendaBovinas => {
    haciendaBovinas.map(haciendaBovina => {
      var totalKilogramos = haciendaBovina.cantidad * haciendaBovina.kilogramoCabeza;
      var valorMercado = totalKilogramos * haciendaBovina.valorKilogramo;

      haciendaBovina.dataValues.totalKilogramos = totalKilogramos;
      haciendaBovina.dataValues.valorMercado = valorMercado;

      if (haciendaBovina.fechaCompra && haciendaBovina.tipoBien == 'Bien de Uso') {
        var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(haciendaBovina.fechaCompra);
        antiguedad = Math.trunc(antiguedad / (1000 * 60 * 60 * 24 * 365))
        var amortizacion = valorMercado / haciendaBovina.vidaUtil
        var amortizacionAcumulada;
        var valorANuevo;

        if (amortizacion * antiguedad >= haciendaBovina.valorMercado) {
          amortizacionAcumulada = haciendaBovina.valorMercado
        } else {
          amortizacionAcumulada = amortizacion * antiguedad
        }

        if (haciendaBovina.valorMercado - amortizacionAcumulada <= 0) {
          valorANuevo = 0
        } else {
          valorANuevo = haciendaBovina.valorMercado - amortizacionAcumulada
        }

        haciendaBovina.dataValues.antiguedad = antiguedad;
        haciendaBovina.dataValues.amortizacion = amortizacion.toFixed(2);
        haciendaBovina.dataValues.amortizacionAcumulada = amortizacionAcumulada.toFixed(2);;
        haciendaBovina.dataValues.valorANuevo = valorANuevo.toFixed(2);
      } else {
        haciendaBovina.dataValues.antiguedad = 0;
        haciendaBovina.dataValues.amortizacion = 0;
        haciendaBovina.dataValues.amortizacionAcumulada = 0;
        haciendaBovina.dataValues.valorANuevo = valorMercado;
      }
    });
    res.render("capital/haciendaBovina/haciendaBovina-list", {
      haciendaBovinas: haciendaBovinas,
      //valorTotal: Totales.valorHaciendaBovinas(haciendaBovinas)
    });
  });
};

haciendaBovinaController.add = function (req, res) {
  reqMC = req.body.movimientoCompra
  if (!req.body.haciendaBovina.fechaCompra) {
    delete req.body.haciendaBovina.fechaCompra
  }
  HaciendaBovina.create(req.body.haciendaBovina).then(haciendaBovina => {
      if (req.body.tipoAlta == 'compra') {
        reqMC.forEach(async mc => {
          await Movimientos.compra(haciendaBovina.fechaCompra, mc.monto, 'HaciendaBovina', haciendaBovina.haciendaId, mc.cuenta, mc.cuentaId, haciendaBovina.empresaId)
        });
      }
      req.flash("success_msg", "Se dio de alta un lote de Hacienda Bovina correctamente");
      res.redirect("/haciendaBovinas");
    })
    .catch(error => {
      console.log(error)
      req.flash("error_msg", "Error al dar de alta un lote de Hacienda Bovina");
      res.redirect("/haciendaBovinas");
    });
};

/* haciendaBovinaController.saveEdit = function (req, res) {
  reqMC = req.body.movimientoCompra
  HaciendaBovina.findByPk(req.params.id).then(haciendaBovina => {
    haciendaBovina
      .update(req.body.haciendaBovina)
      .then(async () => {
        if (req.body.tipoAlta == 'compra') {
          await Movimientos.deshacerCompra('HaciendaBovina', req.params.id)
          reqMC.forEach(mc => {
            Movimientos.compra(haciendaBovina.fechaCompra, mc.monto,'HaciendaBovina', haciendaBovina.haciendaId, mc.cuenta , mc.cuentaId, haciendaBovina.empresaId) 
          });
        }
        req.flash("success_msg", "Se actualizó un haciendaBovina correctamente");
        res.redirect("/haciendaBovinas");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al actualizar un haciendaBovina");
        res.redirect("/haciendaBovinas");
      });
  });
}; */

haciendaBovinaController.delete = function (req, res) {
  HaciendaBovina.destroy({
      where: {
        haciendaId: req.params.id
      }
    }).then(async () => {
      await Movimientos.deshacerCompra('HaciendaBovina', req.params.id)
      req.flash("success_msg", "Se dio de baja un lote de Hacienda Bovina correctamente");
      res.redirect("/haciendaBovinas");
    })
    .catch(err => {
      console.log(err)
      req.flash("error_msg", "Error al dar de baja un lote de Hacienda Bovina");
      res.redirect("/haciendaBovinas");
    });
};

haciendaBovinaController.liquidar = function (req, res) {
  var reqHaciendaBovina = req.body.haciendaBovina
  var reqMovimiento = req.body.movimiento
  
  if (reqMovimiento.cuenta == 'Caja') {
    Caja.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(async caja => {
      
      await Movimientos.venta(reqHaciendaBovina.fechaVenta, reqMovimiento.monto, 'HaciendaBovina', req.params.id, reqMovimiento.cuenta, caja.cajaId, res.locals.empresa.empresaId)
      
      HaciendaBovina.update(reqHaciendaBovina, {
        where: {
          haciendaId: req.params.id
        }
      }).then(() => {
        req.flash("success_msg", "Se liquidó un lote de Hacienda Bovina correctamente");
        res.redirect("/haciendaBovinas");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al liquidar  un lote de Hacienda Bovina");
        res.redirect("/haciendaBovinas");
      });
      
    })
  }
  
  if (reqMovimiento.cuenta == 'Banco') {
    Banco.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(async banco => {
      
      await Movimientos.venta(reqHaciendaBovina.fechaVenta, reqMovimiento.monto, 'HaciendaBovina', req.params.id, reqMovimiento.cuenta, banco.bancoId, res.locals.empresa.empresaId)
      
      HaciendaBovina.update(reqHaciendaBovina, {
        where: {
          haciendaId: req.params.id
        }
      }).then(() => {
        req.flash("success_msg", "Se liquidó un lote de Hacienda Bovina correctamente");
        res.redirect("/haciendaBovinas");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al liquidar un lote de Hacienda Bovina");
        res.redirect("/haciendaBovinas");
      });
    })
  }

};


haciendaBovinaController.deshacerLiquidar = function (req, res) {
  HaciendaBovina.update({
    fechaVenta: null
  }, {
    where: {
      haciendaId: req.params.id
    }
  }).then(async () => {
    await Movimientos.deshacerVenta('HaciendaBovina', req.params.id)
    req.flash("success_msg", "Se deshizo la liquidación de un lote de Hacienda Bovina correctamente");
    res.redirect("/haciendaBovinas");
  })
  .catch(err => {
    console.log(err)
    req.flash("error_msg", "Error al deshacer liquidación de lote de Hacienda Bovina");
    res.redirect("/haciendaBovinas");
  });
};


module.exports = haciendaBovinaController;