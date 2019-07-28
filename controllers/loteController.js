const Totales = require("./../utils/totales")
const Movimientos = require("./../utils/movimientos")
const models = require("./../models");
const Lote = models.Lote;
const Caja = models.Caja;
const Banco = models.Banco;

var loteController = {};

loteController.list = function (req, res) {
  Lote.findAll({
    where: {
      empresaId: res.locals.empresa.empresaId
    }
  }).then(lotes => {
    lotes.map(lote => {
      lote.dataValues.valorLote = lote.superficie * lote.valorHectarea
    })
    res.render("capital/lote/lote-list", {
      lotes: lotes,
      supTotal: Totales.superficieLotes(lotes),
      valorTotal: Totales.valorLotes(lotes)
    });
  });
};

loteController.add = function (req, res) {
  reqLote = req.body.lote
  reqMC = req.body.movimientoCompra
  if (!reqLote.fechaCompra){
    delete reqLote.fechaCompra
  }
  Lote.create(reqLote).then(lote => {
      if (req.body.tipoAlta == 'compra') {
        reqMC.forEach(async mc => {
          await Movimientos.compra(lote.fechaCompra, mc.monto,'Lote', lote.loteId, mc.cuenta , mc.cuentaId, lote.empresaId) 
        });
      }
      req.flash("success_msg", "Se dio de alta un lote correctamente");
      res.redirect("/lotes");
    })
    .catch(error => {
      console.log(error)
      req.flash("error_msg", "Error al dar de alta un lote");
      res.redirect("/lotes");
    });
  };
  
  loteController.saveEdit = function (req, res) {
    reqLote = req.body.lote
    reqMC = req.body.movimientoCompra
    if (!reqLote.fechaCompra){
      delete reqLote.fechaCompra
    }
    Lote.findByPk(req.params.id).then(lote => {
      lote
      .update(reqLote)
      .then(async () => {
        if (req.body.tipoAlta == 'compra') {
          await Movimientos.deshacerCompra('Lote', req.params.id)
          reqMC.forEach(mc => {
            Movimientos.compra(lote.fechaCompra, mc.monto,'Lote', lote.loteId, mc.cuenta , mc.cuentaId, lote.empresaId) 
          });
        }
        req.flash("success_msg", "Se actualizó un lote correctamente");
        res.redirect("/lotes");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al actualizar un lote");
        res.redirect("/lotes");
      });
    });
  };
  
  loteController.delete = function (req, res) {
    Lote.destroy({
      where: {
        loteId: req.params.id
      }
    }).then(async () => {
      await Movimientos.deshacerCompra('Lote', req.params.id)
      
      req.flash("success_msg", "Se dio de baja un lote correctamente");
      res.redirect("/lotes");
    })
    .catch(err => {
      console.log(err)
      req.flash("error_msg", "Error al dar de baja un lote");
      res.redirect("/lotes");
    });
  };
  
  
  loteController.liquidar = function (req, res) {
    var reqLote = req.body.lote
    var reqMovimiento = req.body.movimiento
    
    if (reqMovimiento.cuenta == 'Caja') {
      Caja.findOne({
        where: {
          empresaId: res.locals.empresa.empresaId
        }
      }).then(async caja => {
        
        await Movimientos.venta(reqLote.fechaVenta, reqMovimiento.monto, 'Lote', req.params.id, reqMovimiento.cuenta, caja.cajaId, res.locals.empresa.empresaId)
        
        Lote.update(reqLote, {
          where: {
            loteId: req.params.id
          }
        }).then(() => {
          req.flash("success_msg", "Se liquidó un lote correctamente");
          res.redirect("/lotes");
        })
        .catch(err => {
          console.log(err)
          req.flash("error_msg", "Error al liquidar un lote");
          res.redirect("/lotes");
        });
        
      })
    }
    
    if (reqMovimiento.cuenta == 'Banco') {
      Banco.findOne({
        where: {
          empresaId: res.locals.empresa.empresaId
        }
      }).then(async banco => {
        
        await Movimientos.venta(reqLote.fechaVenta, reqMovimiento.monto, 'Lote', req.params.id, reqMovimiento.cuenta, banco.bancoId, res.locals.empresa.empresaId)
        
        Lote.update(reqLote, {
          where: {
            loteId: req.params.id
          }
        }).then(() => {
          req.flash("success_msg", "Se liquidó un lote correctamente");
          res.redirect("/lotes");
        })
        .catch(err => {
          console.log(err)
          req.flash("error_msg", "Error al liquidar un lote");
          res.redirect("/lotes");
        });
      })
    }
  };
  
  
  loteController.deshacerLiquidar = function (req, res) {
    Lote.update({
      fechaVenta: null
    }, {
      where: {
        loteId: req.params.id
      }
    }).then(async () => {
      await Movimientos.deshacerVenta('Lote', req.params.id)
      req.flash("success_msg", "Se deshizo la liquidación un lote correctamente");
      res.redirect("/lotes");
    })
    .catch(err => {
      console.log(err)
      req.flash("error_msg", "Error al deshacer liquidación un lote");
      res.redirect("/lotes");
    });
};


module.exports = loteController;