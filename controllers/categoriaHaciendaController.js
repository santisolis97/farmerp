const models = require("./../models");
const CategoriaHacienda = models.CategoriaHacienda;
const TipoHacienda = models.TipoHacienda;

var categoriaHaciendaController = {};

categoriaHaciendaController.list = function (req, res) {
    CategoriaHacienda.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        },
        include: [{
            model: TipoHacienda
        }]
    }).then(categoriasHacienda => {
        TipoHacienda.findAll({
            where: {
                empresaId: res.locals.empresa.empresaId
            }
        }).then(tiposHacienda => {
            res.render("ganaderia/categoriaHacienda/categoriaHacienda-list", {
                tiposHacienda: tiposHacienda,
                categoriasHacienda: categoriasHacienda
            });
        })
    });
};

categoriaHaciendaController.add = function (req, res) {
    var reqCategoriaHacienda = req.body.categoriaHacienda
    CategoriaHacienda.create(reqCategoriaHacienda).then(categoriaHacienda => {
            req.flash("success_msg", "Se dio de alta una Categoría de Hacienda correctamente");
            res.redirect("/categoriasHacienda");
        })
        .catch(error => {
            console.log(error)
            req.flash("error_msg", "Error al dar de alta una Categoría de Hacienda");
            res.redirect("/categoriasHacienda");
        });
};

categoriaHaciendaController.saveEdit = function (req, res) {
    var reqCategoriaHacienda = req.body.categoriaHacienda

    CategoriaHacienda.findByPk(req.params.id).then(categoriaHacienda => {
        categoriaHacienda
            .update(reqCategoriaHacienda)
            .then(async () => {
                req.flash("success_msg", "Se actualizó una Categoría de Hacienda correctamente");
                res.redirect("/categoriasHacienda");
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar una Categoría de Hacienda");
                res.redirect("/categoriasHacienda");
            });
    });
};

categoriaHaciendaController.delete = function (req, res) {
    CategoriaHacienda.destroy({
            where: {
                categoriaHaciendaId: req.params.id
            }
        }).then(async () => {
            req.flash("success_msg", "Se dio de baja una Categoría de Hacienda correctamente");
            res.redirect("/categoriasHacienda");
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al dar de baja una Categoría de Hacienda");
            res.redirect("/categoriasHacienda");
        });
};

categoriaHaciendaController.getByTipo = function (req, res) {
    CategoriaHacienda.findAll({
        where: {
            tipoHaciendaId: req.params.tipoHaciendaId
        }
    }).then(categorias => {
        res.send({
            categorias
        })
    })
};
categoriaHaciendaController.getById = function (req, res) {
    CategoriaHacienda.findAll({
        where: {
            categoriaHaciendaId: req.params.categoriaHaciendaId
        }
    }).then(categorias => {
        res.send({
            categorias
        })
    })
};

categoriaHaciendaController.getbyIdCategoria = function (req, res) {
    CategoriaHacienda.findAll({
        where: {
            categoriaHaciendaId: req.params.id
        }
    }).then(categoria => {
        res.send({
            categoria
        })
    })
  };

module.exports = categoriaHaciendaController;