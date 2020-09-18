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
                            empresa.index = []
    
                            var inicioEjercicio = empresa.inicioEjercicio.split('-')
                            let dia = parseInt(inicioEjercicio[2])
                            let mes = parseInt(inicioEjercicio[1]) - 1
                            let anio = parseInt(inicioEjercicio[0])
                            
                            empresa.inicioEjercicioString = dia + '/' + (mes+1) + '/' + anio
                            
                            var finEjercicio = empresa.finEjercicio.split('-')
                            let diaFin = parseInt(finEjercicio[2])
                            let mesFin = parseInt(finEjercicio[1])
                            let anioFin = parseInt(finEjercicio[0])
                            
                            empresa.finEjercicioString = diaFin + '/' + mesFin + '/' + anioFin

                            let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
                            for (let i = 1; i < 13; i++) {
                                if (!(mes < 12)) {
                                    mes = 0
                                    anio += 1
                                }
                                let mesDesc = meses[mes] + ' ' + anio
                                empresa.meses.push(mesDesc)
                                var dato = {index:i,nombre:mesDesc}
                                empresa.index.push(dato)
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