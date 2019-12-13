var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');
const models = require("./../models");
const User = models.User
const Empresa = models.Empresa
const UserEmpresa = models.UserEmpresa


router.get('/', Logged.isLogged, function (req, res) {
    UserEmpresa.findAll({
        include: [{
            model: User, where: {
                role: 'user'
            }
        }, {
            model: Empresa
        }]
    }).then(users => {
        res.render('admin/alumno/alumno-list', {
            users
        })

    })
});




module.exports = router;