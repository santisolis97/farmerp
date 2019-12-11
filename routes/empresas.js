var express = require('express');
var router = express.Router();
const Empresa = require('../models').Empresa
const UserEmpresa = require('../models').UserEmpresa

router.get('/:id', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role == 'admin') {
            Empresa.findOne({
                where: {
                    empresaId: req.params.id
                }
            }).then(empresa => {
                UserEmpresa.destroy({
                    where: {
                        userId : req.user.userId
                    }
                }).then(ue => {
                    UserEmpresa.create({
                        userId: req.user.userId,
                        empresaId: empresa.empresaId
                    }).then(userEmpresa => {
                        res.redirect('/contable/situacionPatrimonial');
                    })
                })

            })
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
})

module.exports = router;