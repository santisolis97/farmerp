const models = require('./../models')
const User = models.User
const UserEmpresa = models.UserEmpresa
const Empresa = models.Empresa


function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        if (res.locals.empresa) {
            return next()
        } else {
            /* if (req.user.role == 'user') { */
                UserEmpresa.findOne({
                    where: {
                        userId: req.user.userId
                    }
                }).then(userEmpresa => {
                    if (userEmpresa) {
                        Empresa.findOne({
                            where: {
                                empresaId: userEmpresa.empresaId
                            }
                        }).then(empresa => {
                            empresa.meses = []
    
                            var inicioEjercicio = empresa.inicioEjercicio.split('-')
                            let mes = parseInt(inicioEjercicio[1]) - 1
                            let anio = parseInt(inicioEjercicio[0])
                            let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
                            for (let i = 1; i < 13; i++) {
                                if (!(mes < 12)) {
                                    mes = 0
                                    anio += 1
                                }
                                let mesDesc = meses[mes] + ' ' + anio
                                empresa.meses.push(mesDesc)
                                mes += 1
                            }
    
                            res.locals.empresa = empresa
                            
                            return next()
                        })
                    } else {
                        return next()
                    }
                })

            /* } else {
                return next()
            } */
        }
    } else {
        res.redirect('/');
    }
}

module.exports = {
    isLogged
}