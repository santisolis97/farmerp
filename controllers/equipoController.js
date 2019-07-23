const Totales = require("./../utils/totales")
const Movimientos = require("./../utils/movimientos")
const models = require("../models");
const Equipo = models.Equipo;
const Caja = models.Caja;
const Banco = models.Banco;

var equipoController = {};

equipoController.list = function (req, res) {
  Equipo.findAll({
    where: {
      empresaId: res.locals.empresa.empresaId
    }
  }).then(equipos => {
    equipos.map(equipo => {
      var antiguedad = new Date(res.locals.empresa.finEjercicio) - new Date(equipo.fechaCompra);
      antiguedad = Math.trunc(antiguedad / (1000*60*60*24*365))
      var valorResidualMonto = equipo.valorUnitario * equipo.valorResidual / 100;
      var amortizacion = (equipo.valorUnitario - valorResidualMonto)/equipo.vidaUtil
      var amortizacionAcumulada;
      var valorANuevo;
      
      if (amortizacion * antiguedad >= equipo.valorUnitario){
        amortizacionAcumulada = equipo.valorUnitario
      } else {
        amortizacionAcumulada = amortizacion * antiguedad
      }
      
      if (equipo.valorUnitario - amortizacionAcumulada <= 0){
        valorANuevo = equipo.valorUnitario
      } else {
        valorANuevo = equipo.valorUnitario - amortizacionAcumulada
      }

      equipo.dataValues.antiguedad = antiguedad;
      equipo.dataValues.amortizacion = amortizacion.toFixed(2);
      equipo.dataValues.amortizacionAcumulada = amortizacionAcumulada.toFixed(2);
      equipo.dataValues.valorResidualMonto = valorResidualMonto.toFixed(2);
      equipo.dataValues.valorANuevo = valorANuevo.toFixed(2);
    });
    res.render("capital/equipo/equipo-list", {
      equipos: equipos,
      valorTotal: Totales.valorEquipos(equipos)
    });
  });
};

equipoController.add = function (req, res) {
  reqMC = req.body.movimientoCompra
  Equipo.create(req.body.equipo).then(equipo => {
    if (req.body.tipoAlta == 'compra') {
      reqMC.forEach(async mc => {
        await Movimientos.compra(equipo.fechaCompra, mc.monto, 'Equipo', equipo.equipoId, mc.cuenta, mc.cuentaId, equipo.empresaId)
      });
    }
      req.flash("success_msg", "Se dio de alta un equipo correctamente");
      res.redirect("/equipos");
    })
    .catch(error => {
      console.log(error)
      req.flash("error_msg", "Error al dar de alta un equipo");
      res.redirect("/equipos");
    });
};

equipoController.saveEdit = function (req, res) {
  reqMC = req.body.movimientoCompra
  Equipo.findByPk(req.params.id).then(equipo => {
    equipo
      .update(req.body.equipo)
      .then(() => {
        if (req.body.tipoAlta == 'compra') {
          Movimientos.deshacerCompra('Equipo', req.params.id)
          reqMC.forEach(mc => {
            Movimientos.compra(equipo.fechaCompra, mc.monto,'Equipo', equipo.equipoId, mc.cuenta , mc.cuentaId, equipo.empresaId) 
          });
        }
        req.flash("success_msg", "Se actualizó un equipo correctamente");
        res.redirect("/equipos");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al actualizar un equipo");
        res.redirect("/equipos");
      });
  });
};

equipoController.delete = function (req, res) {
  Equipo.destroy({
      where: {
        equipoId: req.params.id
      }
    }).then(async () => {
      await Movimientos.deshacerCompra('Equipo', req.params.id)
      req.flash("success_msg", "Se dio de baja un equipo correctamente");
      res.redirect("/equipos");
    })
    .catch(err => {
      console.log(err)
      req.flash("error_msg", "Error al dar de baja un equipo");
      res.redirect("/equipos");
    });
};

equipoController.liquidar = function (req, res) {
  var reqEquipo = req.body.equipo
  var reqMovimiento = req.body.movimiento
  
  if (reqMovimiento.cuenta == 'Caja') {
    Caja.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(async caja => {
      
      await Movimientos.venta(reqEquipo.fechaVenta, reqMovimiento.monto, 'Equipo', req.params.id, reqMovimiento.cuenta, caja.cajaId, res.locals.empresa.empresaId)
      
      Equipo.update(reqEquipo, {
        where: {
          equipoId: req.params.id
        }
      }).then(() => {
        req.flash("success_msg", "Se liquidó equipo correctamente");
        res.redirect("/equipos");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al liquidar equipo");
        res.redirect("/equipos");
      });
      
    })
  }
  
  if (reqMovimiento.cuenta == 'Banco') {
    Banco.findOne({
      where: {
        empresaId: res.locals.empresa.empresaId
      }
    }).then(async banco => {
      
      await Movimientos.venta(reqEquipo.fechaVenta, reqMovimiento.monto, 'Equipo', req.params.id, reqMovimiento.cuenta, banco.bancoId, res.locals.empresa.empresaId)
      
      Equipo.update(reqEquipo, {
        where: {
          equipoId: req.params.id
        }
      }).then(() => {
        req.flash("success_msg", "Se liquidó equipo correctamente");
        res.redirect("/equipos");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al liquidar equipos");
        res.redirect("/equipos");
      });
    })
  }

};


equipoController.deshacerLiquidar = function (req, res) {
  Equipo.update({
    fechaVenta: null
  }, {
    where: {
      equipoId: req.params.id
    }
  }).then(async () => {
    await Movimientos.deshacerVenta('Equipo', req.params.id)
    req.flash("success_msg", "Se deshizo la liquidación de equipo correctamente");
    res.redirect("/equipos");
  })
  .catch(err => {
    console.log(err)
    req.flash("error_msg", "Error al deshacer liquidación de equipo");
    res.redirect("/equipos");
  });
};


module.exports = equipoController;