const Totales = require("./../utils/totales")
const models = require("./../models");
const Lote = models.Lote;
const Caja = models.Caja;
const Banco = models.Banco;
const Inversion = models.Inversion;

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
  var newLote = Lote.create(req.body.lote).then(lote => {
      req.flash("success_msg", "Se dio de alta un lote correctamente");
      res.redirect("/lotes");
    })
    .catch(error => {
      req.flash("error_msg", "Error al dar de alta un lote");
      res.redirect("/lotes");
    });
};

loteController.saveEdit = function (req, res) {
  Lote.findByPk(req.params.id).then(lote => {
    lote
      .update(req.body.lote)
      .then(() => {
        req.flash("success_msg", "Se actualizó un lote correctamente");
        res.redirect("/lotes");
      })
      .catch(err => {
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
    }).then(() => {
      req.flash("success_msg", "Se dio de baja un lote correctamente");
      res.redirect("/lotes");
    })
    .catch(err => {
      req.flash("error_msg", "Error al dar de baja un lote");
      res.redirect("/lotes");
    });
};


loteController.liquidar = function (req, res) {
  var reqLote = req.body.lote

  if (reqLote.cuentaVenta == 'Caja') {
    Caja.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(caja => {

      var movimientos = caja.montoMovimientos + parseFloat(reqLote.valorVenta)
      Caja.update({
        montoMovimientos: movimientos
      }, {
        where: {
          cajaId: caja.cajaId
        }
      }).then(() => {
        Lote.update(reqLote, { where: {
          loteId: req.params.id
        }}).then(() => {
            req.flash("success_msg", "Se liquidó un lote correctamente");
            res.redirect("/lotes");
          })
          .catch(err => {
            req.flash("error_msg", "Error al liquidar un lote");
            res.redirect("/lotes");
          });
      })
    })
  }

  if (reqLote.cuentaVenta == 'Banco') {
    Banco.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(banco => {

      var movimientos = banco.montoMovimientos + parseFloat(reqLote.valorVenta)
      Banco.update({
        montoMovimientos: movimientos
      }, {
        where: {
          bancoId: banco.bancoId
        }
      }).then(() => {
        Lote.update(reqLote, { where: {
          loteId: req.params.id
        }}).then(() => {
            req.flash("success_msg", "Se liquidó un lote correctamente");
            res.redirect("/lotes");
          })
          .catch(err => {
            req.flash("error_msg", "Error al liquidar un lote");
            res.redirect("/lotes");
          });
      })
    })
  }

  if (reqLote.cuentaVenta == 'Inversion') {
    Inversion.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(inversion => {

      var movimientos = inversion.montoMovimientos + parseFloat(reqLote.valorVenta)
      Inversion.update({
        montoMovimientos: movimientos
      }, {
        where: {
          inversionId: inversion.inversionId
        }
      }).then(() => {
        Lote.update(reqLote, { where: {
          loteId: req.params.id
        }}).then(() => {
            req.flash("success_msg", "Se liquidó un lote correctamente");
            res.redirect("/lotes");
          })
          .catch(err => {
            req.flash("error_msg", "Error al liquidar un lote");
            res.redirect("/lotes");
          });
      })
    })
  }

};


loteController.deshacerLiquidar = function (req, res) {
  Lote.findByPk(req.params.id).then(lote => {
    if (lote.cuentaVenta == 'Caja') {
      Caja.findOne({
        where: {
          empresaId: lote.empresaId
        }
      }).then(caja => {
        var movimientos = caja.montoMovimientos - parseFloat(lote.valorVenta)
        Caja.update({
          montoMovimientos: movimientos
        }, {
          where: {
            cajaId: caja.cajaId
          }
        }).then(() => {
          Lote.update({
            cuentaVenta: null,
            valorVenta: null,
            fechaVenta: null
          }, { where: {
            loteId: lote.loteId
          }}).then(() => {
              req.flash("success_msg", "Se liquidó un lote correctamente");
              res.redirect("/lotes");
            })
            .catch(err => {
              req.flash("error_msg", "Error al liquidar un lote");
              res.redirect("/lotes");
            });
        })
      })
    }
  
    if (lote.cuentaVenta == 'Banco') {
      Banco.findOne({
        where: {
          empresaId: lote.empresaId
        }
      }).then(banco => {
        var movimientos = banco.montoMovimientos - parseFloat(lote.valorVenta)
        Banco.update({
          montoMovimientos: movimientos
        }, {
          where: {
            bancoId: banco.bancoId
          }
        }).then(() => {
          Lote.update({
            cuentaVenta: null,
            valorVenta: null,
            fechaVenta: null
          }, { where: {
            loteId: lote.loteId
          }}).then(() => {
              req.flash("success_msg", "Se liquidó un lote correctamente");
              res.redirect("/lotes");
            })
            .catch(err => {
              req.flash("error_msg", "Error al liquidar un lote");
              res.redirect("/lotes");
            });
        })
      })
    }
  
    if (lote.cuentaVenta == 'Inversion') {
      Inversion.findOne({
        where: {
          empresaId: lote.empresaId
        }
      }).then(inversion => {
        var movimientos = inversion.montoMovimientos - parseFloat(lote.valorVenta)
        Inversion.update({
          montoMovimientos: movimientos
        }, {
          where: {
            inversionId: inversion.inversionId
          }
        }).then(() => {
          Lote.update({
            cuentaVenta: null,
            valorVenta: null,
            fechaVenta: null
          }, { where: {
            loteId: lote.loteId
          }}).then(() => {
              req.flash("success_msg", "Se deshizo la liquidación de un lote correctamente");
              res.redirect("/lotes");
            })
            .catch(err => {
              req.flash("error_msg", "Error al deshacer la liquidación de un lote");
              res.redirect("/lotes");
            });
        })
      })
    }
  })

};


module.exports = loteController;