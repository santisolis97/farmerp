const models = require("../models");
const User = models.User;

var multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/src/profileimages");
    },
    filename: function (req, file, cb) {
        var ext = file.originalname.split(".")
        ext = ext[ext.length - 1];
        cb(null, file.fieldname + '-' + Date.now() + '.' + ext)
    }
})

var upload = multer({
    storage: storage
}).single("profileimg");

var perfilController = {};

perfilController.changePassword = function (req, res) {
    var reqPass = req.body.pass
    User.findByPk(req.user.userId).then(user => {
        if (user.validPassword(reqPass.actual)) {
            return user.update({
                password: reqPass.nueva
            }).then(() => {
                req.flash('success_msg', 'Se realizo el cambio de contraseña correctamente');
                res.redirect(req.headers.referer);
                return
            })
        } else {
            req.flash('error_msg', 'La contraseña ingresada no coincide con su contraseña actual');
            res.redirect(req.headers.referer);
        }
    })
}


perfilController.setImage = function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err)
            // A Multer error occurred when uploading.
        } else if (err) {
            console.log(err)
            // An unknown error occurred when uploading.
        }
        User.findByPk(req.user.userId).then(user => {
            return user.update({
                image: 'profileimages/' + req.file.filename
            }).then(() => {
                req.flash('success_msg', 'Se actualizó la imagen de perfil correctamente');
                res.redirect(req.headers.referer);
            })
        }).catch(err => {
            console.log(err)
            req.flash('error_msg', 'Error al actualizar la imagen de perfil');
            res.redirect(req.headers.referer);
        })
    })
}

perfilController.deleteImage = function (req, res) {
    /* Falta Borrar imagen del server */
    User.findByPk(req.user.userId).then(user => {
        user.update({
            image: null
        }).then(() => {
            req.flash('success_msg', 'Se actualizó la imagen de perfil correctamente');
            res.redirect(req.headers.referer);
        })
    }).catch(err => {
        console.log(err)
        req.flash('error_msg', 'Error al actualizar la imagen de perfil');
        res.redirect(req.headers.referer);
    })
}

module.exports = perfilController