const Totales = require("./../utils/totales")
const models = require("../models");
const Stock = models.Stock;

var stockController = {};

stockController.list = function (req, res) {
    Stock.findAll({
        where: {
            empresaId: res.locals.empresa.empresaId
        }
    }).then(stocks => {
        stocks.map(stock => {
            var valorMercado = stock.cantidad * stock.valorUnitario;
            stock.dataValues.valorMercado = valorMercado.toFixed(2);
        });
        
        res.render("capital/stock/stock-list", {
            stocks: stocks,
            valorTotal: Totales.valorStocks(stocks)
        });
    });
};

stockController.add = function (req, res) {
    Stock.create(req.body.stock).then(stock => {
            req.flash("success_msg", "Se dio de alta un producto en stock correctamente");
            res.redirect("/stocks");
        })
        .catch(error => {
            console.log(error)
            req.flash("error_msg", "Error al dar de alta un producto en stock");
            res.redirect("/stocks");
        });
};

stockController.saveEdit = function (req, res) {
    Stock.findByPk(req.params.id).then(stock => {
        stock
            .update(req.body.stock)
            .then(async () => {
                req.flash("success_msg", "Se actualizó un producto en stock correctamente");
                res.redirect("/stocks");
            })
            .catch(err => {
                console.log(err)
                req.flash("error_msg", "Error al actualizar un producto en stock");
                res.redirect("/stocks");
            });
    });
};

stockController.delete = function (req, res) {
    Stock.destroy({
            where: {
                stockId: req.params.id
            }
        }).then(async () => {
            req.flash("success_msg", "Se dio de baja un producto en stock correctamente");
            res.redirect("/stocks");
        })
        .catch(err => {
            console.log(err)
            req.flash("error_msg", "Error al dar de baja un producto en stock");
            res.redirect("/stocks");
        });
};

module.exports = stockController;