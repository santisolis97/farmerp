var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var stock = require('../controllers/stockController');

/* List */
router.get('/', Logged.isLogged, stock.list);

/* Add */
router.post('/add', Logged.isLogged, stock.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, stock.saveEdit)

/* Delete */
router.post('/delete/:id', Logged.isLogged, stock.delete)


module.exports = router;