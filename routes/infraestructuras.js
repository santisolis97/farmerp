var express = require('express');
var router = express.Router();

var infraestructura = require('../controllers/infraestructuraController');

/* List */
router.get('/', infraestructura.list);

/* Add */
router.post('/add', infraestructura.add)

/* Edit */
router.post('/edit/:id', infraestructura.saveEdit)

/* Delete */
router.post('/delete/:id', infraestructura.delete)


module.exports = router;