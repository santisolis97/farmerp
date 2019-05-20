const models = require('./../models')
const User = models.User
const Empresa = models.Empresa


function isLogged(req, res, next){
    Empresa.findOne({where: {
        userId: 1
    }}).then(empresa => {
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