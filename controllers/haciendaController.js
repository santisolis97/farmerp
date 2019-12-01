const Totales = require("../utils/totales")
const Movimientos = require("../utils/movimientos")
const models = require("../models");
const Hacienda = models.Hacienda;
const CategoriaHacienda = models.CategoriaHacienda;
const TipoHacienda = models.TipoHacienda;
const Caja = models.Caja;
const Banco = models.Banco;

var haciendaController = {};

haciendaController.list = function (req, res) {
  Hacienda.findAll({
    where: {
      empresaId: res.locals.empresa.empresaId
    },
    include: [{
      model: TipoHacienda
    }, {
      model: CategoriaHacienda
    }]
  }).then(haciendas => {
    haciendas.map(hacienda => {
      var totalKilogramos = hacienda.cantidad * hacienda.kilogramoCabeza;
      var valorMercado = totalKilogramos * hacienda.valorKilogramo;

      hacienda.dataValues.totalKilogramos = totalKilogramos;
      hacienda.dataValues.valorMercado = valorMercado;

      if (hacienda.fechaCompra && hacienda.tipoBien == 'Bien de Uso') {
        var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(hacienda.fechaCompra);
        antiguedad = Math.trunc(antiguedad / (1000 * 60 * 60 * 24 * 365))
        var amortizacion = valorMercado / hacienda.vidaUtil
        var amortizacionAcumulada;
        var valorANuevo;

        if (amortizacion * antiguedad >= hacienda.dataValues.valorMercado) {
          amortizacionAcumulada = hacienda.dataValues.valorMercado
        } else {
          amortizacionAcumulada = amortizacion * antiguedad
        }

        if (hacienda.dataValues.valorMercado - amortizacionAcumulada <= 0) {
          valorANuevo = 0
        } else {
          valorANuevo = hacienda.dataValues.valorMercado - amortizacionAcumulada
        }

        hacienda.dataValues.antiguedad = antiguedad;
        hacienda.dataValues.amortizacion = amortizacion;
        hacienda.dataValues.amortizacionAcumulada = amortizacionAcumulada;
        hacienda.dataValues.valorANuevo = valorANuevo;
      } else {
        hacienda.dataValues.antiguedad = 0;
        hacienda.dataValues.amortizacion = 0;
        hacienda.dataValues.amortizacionAcumulada = 0;
        hacienda.dataValues.valorANuevo = valorMercado;
      }
    });

    TipoHacienda.findAll({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(tiposHacienda => {
      res.render("capital/hacienda/hacienda-list", {
        haciendas,
        tiposHacienda
      });
    })
  });
};

haciendaController.add = function (req, res) {
  reqMC = req.body.movimientoCompra
  if (!req.body.hacienda.fechaCompra) {
    delete req.body.hacienda.fechaCompra
  }
  Hacienda.create(req.body.hacienda).then(hacienda => {
      if (req.body.tipoAlta == 'compra') {
        reqMC.forEach(async mc => {
          await Movimientos.compra(hacienda.fechaCompra, mc.monto, 'Hacienda', hacienda.haciendaId, mc.cuenta, mc.cuentaId, hacienda.empresaId)
        });
      }
      req.flash("success_msg", "Se dio de alta un lote de Hacienda correctamente");
      res.redirect("/haciendas");
    })
    .catch(error => {
      console.log(error)
      req.flash("error_msg", "Error al dar de alta un lote de Hacienda");
      res.redirect("/haciendas");
    });
};

haciendaController.saveEdit = function (req, res) {
  reqMC = req.body.movimientoCompra
  Hacienda.findByPk(req.params.id).then(hacienda => {
    hacienda
      .update(req.body.hacienda)
      .then(async () => {
        if (req.body.tipoAlta == 'compra') {
          await Movimientos.deshacerCompra('Hacienda', req.params.id)
          reqMC.forEach(mc => {
            Movimientos.compra(hacienda.fechaCompra, mc.monto,'Hacienda', hacienda.haciendaId, mc.cuenta , mc.cuentaId, hacienda.empresaId) 
          });
        }
        req.flash("success_msg", "Se actualizó un lote de Hacienda correctamente");
        res.redirect("/haciendas");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al actualizar un lote de Hacienda");
        res.redirect("/haciendas");
      });
  });
};

haciendaController.delete = function (req, res) {
  Hacienda.destroy({
      where: {
        haciendaId: req.params.id
      }
    }).then(async () => {
      await Movimientos.deshacerCompra('Hacienda', req.params.id)
      req.flash("success_msg", "Se dio de baja un lote de Hacienda correctamente");
      res.redirect("/haciendas");
    })
    .catch(err => {
      console.log(err)
      req.flash("error_msg", "Error al dar de baja un lote de Hacienda");
      res.redirect("/haciendas");
    });
};

haciendaController.liquidar = function (req, res) {
  var reqHaciendaBovina = req.body.hacienda
  var reqMovimiento = req.body.movimiento

  if (reqMovimiento.cuenta == 'Caja') {
    Caja.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(async caja => {

      await Movimientos.venta(reqHaciendaBovina.fechaVenta, reqMovimiento.monto, 'Hacienda', req.params.id, reqMovimiento.cuenta, caja.cajaId, res.locals.empresa.empresaId)

      Hacienda.update(reqHaciendaBovina, {
          where: {
            haciendaId: req.params.id
          }
        }).then(() => {
          req.flash("success_msg", "Se liquidó un lote de Hacienda correctamente");
          res.redirect("/haciendas");
        })
        .catch(err => {
          console.log(err)
          req.flash("error_msg", "Error al liquidar  un lote de Hacienda");
          res.redirect("/haciendas");
        });

    })
  }

  if (reqMovimiento.cuenta == 'Banco') {
    Banco.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(async banco => {

      await Movimientos.venta(reqHaciendaBovina.fechaVenta, reqMovimiento.monto, 'Hacienda', req.params.id, reqMovimiento.cuenta, banco.bancoId, res.locals.empresa.empresaId)

      Hacienda.update(reqHaciendaBovina, {
          where: {
            haciendaId: req.params.id
          }
        }).then(() => {
          req.flash("success_msg", "Se liquidó un lote de Hacienda correctamente");
          res.redirect("/haciendas");
        })
        .catch(err => {
          console.log(err)
          req.flash("error_msg", "Error al liquidar un lote de Hacienda");
          res.redirect("/haciendas");
        });
    })
  }

};


haciendaController.deshacerLiquidar = function (req, res) {
  Hacienda.update({
      fechaVenta: null
    }, {
      where: {
        haciendaId: req.params.id
      }
    }).then(async () => {
      await Movimientos.deshacerVenta('Hacienda', req.params.id)
      req.flash("success_msg", "Se deshizo la liquidación de un lote de Hacienda correctamente");
      res.redirect("/haciendas");
    })
    .catch(err => {
      console.log(err)
      req.flash("error_msg", "Error al deshacer liquidación de lote de Hacienda");
      res.redirect("/haciendas");
    });
};


module.exports = haciendaController;