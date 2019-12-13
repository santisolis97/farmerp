const models = require("../models");
const User = models.User;
const Mailing = require("../utils/Mailing");
var randtoken = require('rand-token');

var administradorController = {};

administradorController.list = function (req, res) {
    User.findAll({
        where: {
            role: 'admin'
        }
    }).then(admins => {
        res.render('admin/administrador/administrador-list', {
            admins
        })
    });
};

administradorController.add = function (req, res) {
    var reqUser = req.body.user
    var token = randtoken.generate(8);

    reqUser.password = token;
    reqUser.role = 'admin'

    User.create(reqUser).then(user => {
            var para = user.email;
            var asunto = "Bienvenido!";
            var mensaje = 'Has sido dado de alta en nuestro sistema, ya puedes acceder a tu cuenta con las credenciales que se muestran a continuación. Puedes cambiar tu contraseña desde el menú "Mi Perfil".\n\n' +
                'Usuario: ' + user.email + '\n' +
                'Contraseña: ' + token + '\n\n\n\n' +
                req.headers.origin + '\n' +
                'Equipo FarmERP.\n'
            Mailing.enviarMail(para, asunto, mensaje);

            req.flash("success_msg", "Se dio de alta un administrador correctamente");
            res.redirect("/administradores");
        })
        .catch(error => {
            console.log(error)
            req.flash("error_msg", "Error al dar de alta un administrador");
            res.redirect("/stocks");
        });
};

administradorController.saveEdit = function (req, res) {
    res.redirect('/administradores')
};

administradorController.delete = function (req, res) {
    res.redirect('/administradores')
};

module.exports = administradorController;