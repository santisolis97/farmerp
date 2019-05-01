const models = require("./../models");
const Lote = models.Lote;

var loteController = {};

loteController.list = function (req, res) {
  Lote.findAll().then(lotes => {
    res.render("capital/lote/lote-list", {
      lotes: lotes
    });
  });
};

loteController.add = function (req, res) {
  var newLote = Lote.build(req.body.lote);

  newLote
    .save()
    .then(lote => {
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

module.exports = loteController;