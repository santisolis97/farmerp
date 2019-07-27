const models = require('./../models')
const User = models.User
const Empresa = models.Empresa


function isLogged(req, res, next){
    Empresa.findOne({where: {
        userId: 1
    }}).then(empresa => {
        empresa.meses = []
        var inicioEjercicio = empresa.inicioEjercicio.split('-')
        let mes = parseInt(inicioEjercicio[1]) -1
        let anio = parseInt(inicioEjercicio[0])
        let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        for (let i = 1; i < 13; i++) {
            if (!(mes < 12)){
                mes = 0
                anio += 1
            }
            let mesDesc = meses[mes] + ' ' + anio
            empresa.meses.push(mesDesc)
            mes += 1
        }

        User.findByPk(1).then(user => {
            res.locals.user = user
            res.locals.empresa = empresa
            return next()
        })
    })
}

module.exports = {
    isLogged
}