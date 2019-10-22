var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');

var pradera = require('../controllers/praderaController');

/* List */
router.get('/', Logged.isLogged, pradera.list);

/* Add */
router.post('/add', Logged.isLogged, pradera.add)

/* Edit */
router.post('/edit/:id', Logged.isLogged, pradera.saveEdit)

/* Delete */
router.post('/delete/:id', Logged.isLogged, pradera.delete)


module.exports = router;