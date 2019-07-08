const Totales = require("./../utils/totales")
const models = require("../models");
const Infraestructura = models.Infraestructura;
const Caja = models.Caja;
const Banco = models.Banco;
const Inversion = models.Inversion;

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
        infraestructuraId: req.params.id
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

infraestructuraController.liquidar = function (req, res) {
  var reqInfraestructura = req.body.infraestructura

  if (reqInfraestructura.cuentaVenta == 'Caja') {
    Caja.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(caja => {

      var movimientos = caja.montoMovimientos + parseFloat(reqInfraestructura.valorVenta)
      Caja.update({
        montoMovimientos: movimientos
      }, {
        where: {
          cajaId: caja.cajaId
        }
      }).then(() => {
        Infraestructura.update(reqInfraestructura, { where: {
          infraestructuraId: req.params.id
        }}).then(() => {
            req.flash("success_msg", "Se liquidó una infraestructura correctamente");
            res.redirect("/infraestructuras");
          })
          .catch(err => {
            req.flash("error_msg", "Error al liquidar una infraestructura");
            res.redirect("/infraestructuras");
          });
      })
    })
  }

  if (reqInfraestructura.cuentaVenta == 'Banco') {
    Banco.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(banco => {

      var movimientos = banco.montoMovimientos + parseFloat(reqInfraestructura.valorVenta)
      Banco.update({
        montoMovimientos: movimientos
      }, {
        where: {
          bancoId: banco.bancoId
        }
      }).then(() => {
        Infraestructura.update(reqInfraestructura, { where: {
          infraestructuraId: req.params.id
        }}).then(() => {
            req.flash("success_msg", "Se liquidó una infraestructura correctamente");
            res.redirect("/infraestructuras");
          })
          .catch(err => {
            req.flash("error_msg", "Error al liquidar una infraestructura");
            res.redirect("/infraestructuras");
          });
      })
    })
  }

  if (reqInfraestructura.cuentaVenta == 'Inversion') {
    Inversion.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(inversion => {

      var movimientos = inversion.montoMovimientos + parseFloat(reqInfraestructura.valorVenta)
      Inversion.update({
        montoMovimientos: movimientos
      }, {
        where: {
          inversionId: inversion.inversionId
        }
      }).then(() => {
        Infraestructura.update(reqInfraestructura, { where: {
          infraestructuraId: req.params.id
        }}).then(() => {
            req.flash("success_msg", "Se liquidó una infraestructura correctamente");
            res.redirect("/infraestructuras");
          })
          .catch(err => {
            req.flash("error_msg", "Error al liquidar una infraestructura");
            res.redirect("/infraestructuras");
          });
      })
    })
  }

};


infraestructuraController.deshacerLiquidar = function (req, res) {
  Infraestructura.findByPk(req.params.id).then(infraestructura => {
    if (infraestructura.cuentaVenta == 'Caja') {
      Caja.findOne({
        where: {
          empresaId: infraestructura.empresaId
        }
      }).then(caja => {
        var movimientos = caja.montoMovimientos - parseFloat(infraestructura.valorVenta)
        Caja.update({
          montoMovimientos: movimientos
        }, {
          where: {
            cajaId: caja.cajaId
          }
        }).then(() => {
          Infraestructura.update({
            cuentaVenta: null,
            valorVenta: null,
            fechaVenta: null
          }, { where: {
            infraestructuraId: infraestructura.infraestructuraId
          }}).then(() => {
              req.flash("success_msg", "Se liquidó una infraestructura correctamente");
              res.redirect("/infraestructuras");
            })
            .catch(err => {
              req.flash("error_msg", "Error al liquidar una infraestructura");
              res.redirect("/infraestructuras");
            });
        })
      })
    }
  
    if (infraestructura.cuentaVenta == 'Banco') {
      Banco.findOne({
        where: {
          empresaId: infraestructura.empresaId
        }
      }).then(banco => {
        var movimientos = banco.montoMovimientos - parseFloat(infraestructura.valorVenta)
        Banco.update({
          montoMovimientos: movimientos
        }, {
          where: {
            bancoId: banco.bancoId
          }
        }).then(() => {
          Infraestructura.update({
            cuentaVenta: null,
            valorVenta: null,
            fechaVenta: null
          }, { where: {
            infraestructuraId: infraestructura.infraestructuraId
          }}).then(() => {
              req.flash("success_msg", "Se liquidó una infraestructura correctamente");
              res.redirect("/infraestructuras");
            })
            .catch(err => {
              req.flash("error_msg", "Error al liquidar una infraestructura");
              res.redirect("/infraestructuras");
            });
        })
      })
    }
  
    if (infraestructura.cuentaVenta == 'Inversion') {
      Inversion.findOne({
        where: {
          empresaId: infraestructura.empresaId
        }
      }).then(inversion => {
        var movimientos = inversion.montoMovimientos - parseFloat(infraestructura.valorVenta)
        Inversion.update({
          montoMovimientos: movimientos
        }, {
          where: {
            inversionId: inversion.inversionId
          }
        }).then(() => {
          Infraestructura.update({
            cuentaVenta: null,
            valorVenta: null,
            fechaVenta: null
          }, { where: {
            infraestructuraId: infraestructura.infraestructuraId
          }}).then(() => {
              req.flash("success_msg", "Se deshizo la liquidación de una infraestructura correctamente");
              res.redirect("/infraestructuras");
            })
            .catch(err => {
              req.flash("error_msg", "Error al deshacer la liquidación de una infraestructura");
              res.redirect("/infraestructuras");
            });
        })
      })
    }
  })

};


module.exports = infraestructuraController;