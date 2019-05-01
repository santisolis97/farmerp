const models = require("../models");
const Infraestructura = models.Infraestructura;

var infraestructuraController = {};

infraestructuraController.list = function (req, res) {
  Infraestructura.findAll().then(infraestructuras => {
    res.render("capital/infraestructura/infraestructura-list", {
      infraestructuras: infraestructuras
    });
  });
};

infraestructuraController.add = function (req, res) {
  var newInfraestructura = Infraestructura.build(req.body.infraestructura);

  newInfraestructura
    .save()
    .then(infraestructura => {
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
        loteId: req.params.id
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

module.exports = infraestructuraController;