const Totales = require("./../utils/totales")
const models = require("../models");
const Rodado = models.Rodado;
const Caja = models.Caja;
const Banco = models.Banco;
const Inversion = models.Inversion;

var rodadoController = {};

rodadoController.list = function (req, res) {
  var valorTotal = 0
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

      rodado.dataValues.valorMercado = valorMercado;
      rodado.dataValues.antiguedad = antiguedad;
      rodado.dataValues.amortizacion = amortizacion;
      rodado.dataValues.amortizacionAcumulada = amortizacionAcumulada;
      rodado.dataValues.valorResidualMonto = valorResidualMonto;
      rodado.dataValues.valorANuevo = valorANuevo;
    });
    res.render("capital/rodado/rodado-list", {
      rodados: rodados,
      valorTotal: Totales.valorRodados(rodados)
    });
  });
};

rodadoController.add = function (req, res) {
  Rodado.create(req.body.rodado).then(rodado => {
      req.flash("success_msg", "Se dio de alta un rodado correctamente");
      res.redirect("/rodados");
    })
    .catch(error => {
      req.flash("error_msg", "Error al dar de alta un rodado");
      res.redirect("/rodados");
    });
};

rodadoController.saveEdit = function (req, res) {
  Rodado.findByPk(req.params.id).then(rodado => {
    rodado
      .update(req.body.rodado)
      .then(() => {
        req.flash("success_msg", "Se actualizó un rodado correctamente");
        res.redirect("/rodados");
      })
      .catch(err => {
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
    }).then(() => {
      req.flash("success_msg", "Se dio de baja un rodado correctamente");
      res.redirect("/rodados");
    })
    .catch(err => {
      req.flash("error_msg", "Error al dar de baja un rodado");
      res.redirect("/rodados");
    });
};

rodadoController.liquidar = function (req, res) {
  var reqRodado = req.body.rodado
    console.log(reqRodado)
  if (reqRodado.cuentaVenta == 'Caja') {
    Caja.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(caja => {

      var movimientos = caja.montoMovimientos + parseFloat(reqRodado.valorVenta)
      Caja.update({
        montoMovimientos: movimientos
      }, {
        where: {
          cajaId: caja.cajaId
        }
      }).then(() => {
        Rodado.update(reqRodado, { where: {
          rodadoId: req.params.id
        }}).then(() => {
            req.flash("success_msg", "Se liquidó un rodado correctamente");
            res.redirect("/rodados");
          })
          .catch(err => {
            req.flash("error_msg", "Error al liquidar un rodado");
            res.redirect("/rodados");
          });
      })
    })
  }

  if (reqRodado.cuentaVenta == 'Banco') {
    Banco.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(banco => {

      var movimientos = banco.montoMovimientos + parseFloat(reqRodado.valorVenta)
      Banco.update({
        montoMovimientos: movimientos
      }, {
        where: {
          bancoId: banco.bancoId
        }
      }).then(() => {
        Rodado.update(reqRodado, { where: {
          rodadoId: req.params.id
        }}).then(() => {
            req.flash("success_msg", "Se liquidó un rodado correctamente");
            res.redirect("/rodados");
          })
          .catch(err => {
            req.flash("error_msg", "Error al liquidar un rodado");
            res.redirect("/rodados");
          });
      })
    })
  }

  if (reqRodado.cuentaVenta == 'Inversion') {
    Inversion.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(inversion => {

      var movimientos = inversion.montoMovimientos + parseFloat(reqRodado.valorVenta)
      Inversion.update({
        montoMovimientos: movimientos
      }, {
        where: {
          inversionId: inversion.inversionId
        }
      }).then(() => {
        Rodado.update(reqRodado, { where: {
          rodadoId: req.params.id
        }}).then(() => {
            req.flash("success_msg", "Se liquidó un rodado correctamente");
            res.redirect("/rodados");
          })
          .catch(err => {
            req.flash("error_msg", "Error al liquidar un rodado");
            res.redirect("/rodados");
          });
      })
    })
  }

};


rodadoController.deshacerLiquidar = function (req, res) {
  Rodado.findByPk(req.params.id).then(rodado => {
    if (rodado.cuentaVenta == 'Caja') {
      Caja.findOne({
        where: {
          empresaId: rodado.empresaId
        }
      }).then(caja => {
        var movimientos = caja.montoMovimientos - parseFloat(rodado.valorVenta)
        Caja.update({
          montoMovimientos: movimientos
        }, {
          where: {
            cajaId: caja.cajaId
          }
        }).then(() => {
          Rodado.update({
            cuentaVenta: null,
            valorVenta: null,
            fechaVenta: null
          }, { where: {
            rodadoId: rodado.rodadoId
          }}).then(() => {
              req.flash("success_msg", "Se liquidó un rodado correctamente");
              res.redirect("/rodados");
            })
            .catch(err => {
              req.flash("error_msg", "Error al liquidar un rodado");
              res.redirect("/rodados");
            });
        })
      })
    }
  
    if (rodado.cuentaVenta == 'Banco') {
      Banco.findOne({
        where: {
          empresaId: rodado.empresaId
        }
      }).then(banco => {
        var movimientos = banco.montoMovimientos - parseFloat(rodado.valorVenta)
        Banco.update({
          montoMovimientos: movimientos
        }, {
          where: {
            bancoId: banco.bancoId
          }
        }).then(() => {
          Rodado.update({
            cuentaVenta: null,
            valorVenta: null,
            fechaVenta: null
          }, { where: {
            rodadoId: rodado.rodadoId
          }}).then(() => {
              req.flash("success_msg", "Se liquidó un rodado correctamente");
              res.redirect("/rodados");
            })
            .catch(err => {
              req.flash("error_msg", "Error al liquidar un rodado");
              res.redirect("/rodados");
            });
        })
      })
    }
  
    if (rodado.cuentaVenta == 'Inversion') {
      Inversion.findOne({
        where: {
          empresaId: rodado.empresaId
        }
      }).then(inversion => {
        var movimientos = inversion.montoMovimientos - parseFloat(rodado.valorVenta)
        Inversion.update({
          montoMovimientos: movimientos
        }, {
          where: {
            inversionId: inversion.inversionId
          }
        }).then(() => {
          Rodado.update({
            cuentaVenta: null,
            valorVenta: null,
            fechaVenta: null
          }, { where: {
            rodadoId: rodado.rodadoId
          }}).then(() => {
              req.flash("success_msg", "Se deshizo la liquidación de un rodado correctamente");
              res.redirect("/rodados");
            })
            .catch(err => {
              req.flash("error_msg", "Error al deshacer la liquidación de un rodado");
              res.redirect("/rodados");
            });
        })
      })
    }
  })

};


module.exports = rodadoController;