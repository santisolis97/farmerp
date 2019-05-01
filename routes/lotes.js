var express = require('express');
var router = express.Router();

var lote = require('./../controllers/loteController');

/* List */
router.get('/', lote.list);

/* Add */
router.post('/add', lote.add)

/* Edit */
router.post('/edit/:id', lote.saveEdit)

/* Delete */
router.post('/delete/:id', lote.delete)


module.exports = router;
