var express = require('express');
var router = express.Router();
const Logged = require('../utils/logged');
const UserEmpresa = require('../models').UserEmpresa

var grupo = require('../controllers/grupoController');

/* List */
router.get('/', (req, res, next) => {
    return UserEmpresa.destroy({
        where: {
            userId: req.user.userId
        }
    }).then(us => next())
}, Logged.isLogged, grupo.list);

/* Add */
router.post('/add', Logged.isLogged, grupo.altaGrupo)

/* Edit */
router.post('/edit/:id', Logged.isLogged, grupo.saveEdit)

/* Delete */
//router.post('/delete/:id', Logged.isLogged, hacienda.delete)

/* SendMail */
router.post('/sendMail/:id', Logged.isLogged, grupo.sendMail)


module.exports = router;