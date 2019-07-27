var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

//var haciendaBovina = require('./../controllers/haciendaBovinaController');

/* List */
//router.get('/', Logged.isLogged, haciendaBovina.list);
router.get('/', Logged.isLogged, function(req,res){
    res.render('./../views/capital/haciendaBovina/haciendaBovina-list')
});

/* Add */
//router.post('/add', Logged.isLogged, haciendaBovina.add)

/* Edit */
//router.post('/edit/:id', Logged.isLogged, haciendaBovina.saveEdit)

/* Liquidar */
//router.post('/liquidar/:id', Logged.isLogged, haciendaBovina.liquidar)

/* Deshacer Liquidar */
//router.post('/deshacerLiquidar/:id', Logged.isLogged, haciendaBovina.deshacerLiquidar)

/* Delete */
//router.post('/delete/:id', Logged.isLogged, haciendaBovina.delete)


module.exports = router;
