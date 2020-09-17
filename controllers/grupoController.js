const models = require("./../models");
const User = models.User;
const Empresa = models.Empresa;
const UserEmpresa = models.UserEmpresa;
const Mailing = require("../utils/Mailing");
var randtoken = require('rand-token');

const grupoController = {};

grupoController.list = function (req, res) {
    Empresa.findAll().then(empresas => {
        if (empresas.length > 0) {
            for (let i = 0; i < empresas.length; i++) {
                const empresa = empresas[i];
                UserEmpresa.findAll({
                    where: {
                        empresaId: empresa.empresaId
                    },
                    include: [{
                        model: User
                    }]
                }).then(users => {
                    empresa.users = users
                    empresa.dataValues.users = users
                    if (i == empresas.length - 1) {
                        res.render('admin/grupo/grupo-list', {
                            empresas
                        })
                    }
                })
            }
        } else {
            res.render('admin/grupo/grupo-list', {
                empresas
            })
        }
    })

}

grupoController.altaGrupo = function (req, res) {
    var nombreEmpresa = req.body.empresa.nombre;
    var anioCursado = req.body.cursado.anio;
    var users = req.body.users

    var inicioEjercicio = new Date(parseInt(anioCursado), 6, 1)
    var finEjercicio = new Date(parseInt(anioCursado) + 1, 5, 30)

    var empresa = {
        nombre: nombreEmpresa,
        inicioEjercicio,
        finEjercicio
    }

    Empresa.create(empresa).then(empresa => {
        var caja = {
            montoInicial: 0.0,
            empresaId: empresa.empresaId
        }

        var banco = {
            montoInicial: 0.0,
            empresaId: empresa.empresaId
        }

        var inversion = {
            montoInicial: 0.0,
            empresaId: empresa.empresaId
        }

        var agriculturaparametros = {
            iva:0.0,
            alicuota:0.0,
            empresaId: empresa.empresaId
        }

        models.Caja.create(caja)
        models.Banco.create(banco)
        models.Inversion.create(inversion)
        models.parametrosAgricultura.create(agriculturaparametros)

        users.forEach(user => {
            var token = randtoken.generate(8);
            user.password = token;
            user.role = 'user';

            User.create(user).then(user => {
                var userEmpresa = {
                    userId: user.userId,
                    empresaId: empresa.empresaId,
                    anioCursado
                }

                UserEmpresa.create(userEmpresa).then(userEmpresa => {
                    var para = user.email;
                    var asunto = "Bienvenido!";
                    var mensaje = 'Has sido dado de alta en nuestro sistema, ya puedes acceder a tu cuenta con las credenciales que se muestran a continuación. Puedes cambiar tu contraseña desde el menú "Mi Perfil".\n\n' +
                        'Usuario: ' + user.email + '\n' +
                        'Contraseña: ' + token + '\n\n\n\n' +
                        req.headers.origin + '\n' +
                        'Equipo FarmERP.\n'
                    return Mailing.enviarMail(para, asunto, mensaje);
                })
            })
        })

        req.flash('success_msg', 'Se dio de alta un nuevo grupo de alumnos correctamente');
        res.redirect('/grupos')
    })
}

grupoController.saveEdit = function (req, res) {
    var nombreEmpresa = req.body.empresa.nombre;
    var anioCursado = req.body.cursado.anio;
    var users = req.body.users

    Empresa.findByPk(req.params.id).then(empresa => {
        return empresa.update({
            nombre: nombreEmpresa
        })
    })

    // Por cada user in users
    //   Busco si existe el mail
    //       existe
    //          si la empresa no se corresponde con la que tiene asignada actualizo userEmpresa con el id actual (Cambio de grupo).
    //          actualizo el usuario y actualizo el usuarioEmpresa
    //      no existe
    //          genero el usuario => genero el usuarioEmpresa
    // 
    // Borro de la tabla users y usersEmpresa los que tengan rol user, id empresa del parámetro y el mail no se encuentre en la lista de users         

    if (users) {
        users.forEach(user => {
            User.findOne({
                where: {
                    email: user.email
                },
                include: [{
                    model: UserEmpresa
                }]
            }).then(async u => {
                if (u) {
                    if (u.UserEmpresas[0].empresaId != req.params.id) {
                        await UserEmpresa.update({
                            empresaId: req.params.id
                        }, {
                            where: {
                                userId: u.userId
                            }
                        })
                    }

                    await UserEmpresa.update({
                        anioCursado
                    }, {
                        where: {
                            empresaId: req.params.id
                        }
                    })

                    await User.update(user, {
                        where: {
                            email: user.email
                        }
                    })
                } else {
                    var token = randtoken.generate(8);
                    user.password = token;
                    user.role = 'user';

                    await User.create(user).then(user => {
                        var userEmpresa = {
                            userId: user.userId,
                            empresaId: req.params.id,
                            anioCursado
                        }

                        return UserEmpresa.create(userEmpresa).then(userEmpresa => {
                            var para = user.email;
                            var asunto = "Bienvenido!";
                            var mensaje = 'Has sido dado de alta en nuestro sistema, ya puedes acceder a tu cuenta con las credenciales que se muestran a continuación. Puedes cambiar tu contraseña desde el menú "Mi Perfil".\n\n' +
                                'Usuario: ' + user.email + '\n' +
                                'Contraseña: ' + token + '\n\n\n\n' +
                                req.headers.origin + '\n' +
                                'Equipo FarmERP.\n'
                            return Mailing.enviarMail(para, asunto, mensaje);
                        })
                    })
                }
            })
        })

        UserEmpresa.findAll({
            where: {
                empresaId: req.params.id
            },
            include: [{
                model: User
            }]
        }).then(ues => {
            ues.forEach(ue => {
                let id = ue.userId
                let existMail = false
                users.forEach(user => {
                    if (user.email == ue.User.email) {
                        existMail = true
                    }
                })

                if (!existMail) {
                    UserEmpresa.destroy({
                        where: {
                            userId: id
                        }
                    }).then(() => {
                        User.destroy({
                            where: {
                                userId: id
                            }
                        })
                    })
                }
            })
        }).then(() => {
            req.flash('success_msg', 'Se actualizó un grupo de alumnos correctamente');
            res.redirect('/grupos')
        })
    } else {
        req.flash('success_msg', 'Se actualizó un grupo de alumnos correctamente');
        res.redirect('/grupos')
    }
}

grupoController.sendMail = function (req, res) {
    let email = req.body.email
    email.mensaje += '\n\n\n\n' + req.headers.origin + '\nEquipo FarmERP.\n'

    UserEmpresa.findAll({
        where: {
            empresaId: req.params.id
        },
        include: [{
            model: User
        }]
    }).then(users => {
        if (users){
            users.forEach(userEmpresa => {
                Mailing.enviarMail(userEmpresa.User.email, email.asunto, email.mensaje);
            })
        }
        req.flash('success_msg', 'Se envió retroalimentación a un grupo de alumnos correctamente');
        res.redirect('/grupos')
    })
}

module.exports = grupoController;