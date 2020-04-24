const User = require("./../models").User;
const UserEmpresa = require("./../models").UserEmpresa;
const Mailing = require("../utils/Mailing");
var randtoken = require('rand-token');

const controller = {};

controller.logout = function (req, res) {
  req.logout();
  req.session.destroy(function (err) {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
}

controller.forgot = function (req, res) {
  if (req.params.email) {
    res.render('../views/forgot', {
      email: req.params.email
    });
  } else {
    res.render('../views/forgot', {
      email: null
    });
  }
}

controller.forgotRes = function (req, res, next) {
  var token = randtoken.generate(40);
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (!user) {
      req.flash('error_msg', 'No existe usuario con ese email');
      return res.redirect('/auth/forgot');
    }
    var dateExpire = Date.now() + 3600000; // 1 hour
    return user.update({
      resetPasswordToken: token,
      resetPasswordExpires: dateExpire
    }).then(user => {
      var para = user.email;
      var asunto = "Recuperar Contraseña";
      var mensaje = 'Estas recibiendo este mensaje porque solicitaste el reestablecimiento de tu contraseña.\n\n' +
        'Hacé click en el siguiente enlace, o copialo en el navegador para continuar el proceso:\n\n' +
        req.headers.origin + '/auth/resetpassword/' + token + '\n\n' +
        'Equipo FarmERP. \n'
      return Mailing.enviarMail(para, asunto, mensaje);
    }).then(() => {
      req.flash('success_msg', 'Se envió correctamente el email para recuperar su contraseña');
      res.redirect('/')
    });
  });
};

controller.reset = function (req, res) {
  User.findOne({
    where: {
      resetPasswordToken: req.params.token
    }
  }).then(user => {
    if (!user) {
      req.flash('error_msg', 'El enlace para cambio de contraseña no es valido o ha expirado, intente nuevamente.');
      return res.redirect('/auth/forgot');
    }
    //console.log('Expires: ' + user.resetPasswordExpires + ', Actual: ' + new Date())
    if (user.resetPasswordExpires < new Date()) {
      req.flash('error_msg', 'El enlace para cambio de contraseña no es valido o ha expirado, intente nuevamente.');
      return res.redirect('/auth/forgot');
    }
    return res.render('../views/resetPassword', {
      user: req.user
    });
  });
};

controller.resetRes = function (req, res) {
  if (req.body.password == req.body.passwordAgain) {
    User.findOne({
      where: {
        resetPasswordToken: req.params.token
      }
    }).then(user => {
      if (!user) {
        req.flash('error_msg', 'El enlace para cambio de contraseña no es valido o ha expirado, intente nuevamente.');
        return res.redirect('/auth/forgot');
      }
      //console.log('Expires: ' + user.resetPasswordExpires + ', Actual: ' + new Date())
      if (user.resetPasswordExpires < new Date()) {
        req.flash('error_msg', 'El enlace para cambio de contraseña no es valido o ha expirado, intente nuevamente.');
        return res.redirect('/auth/forgot');
      }
      return user.update({
        password: req.body.password,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }).then(user => {
        var para = user.email;
        var asunto = 'Contraseña cambiada satisfactoriamente';
        var mensaje = 'Se ha cambiado la contraseña de su cuenta satisfactoriamente. Ya puede usar la aplicación con sus nuevas credenciales.\n\n\n\n' +
          req.headers.origin + '\n' +
          'Equipo FarmERP.\n'
        return Mailing.enviarMail(para, asunto, mensaje);
      }).then(() => {
        req.flash('success_msg', 'Se ha cambiado la contraseña satisfactoriamente, ingrese utilizando sus nuevas credenciales');
        return res.redirect('/');
      })
    });
  } else {
    req.flash('error_msg', 'Las contraseñas ingresadas no son iguales, por favor intente nuevamente.');
    return res.redirect(req.headers.referer);
  }
}

controller.edit = function (req, res) {
  let reqUser = req.body.user
  User.findByPk(req.params.userId).then(user => {
    user.update(reqUser).then(() => {
      req.flash('success_msg', 'Se actualizaron datos de un usuario correctamente');
      res.redirect(req.headers.referer);
    }).catch(err => {
      req.flash('error_msg', 'Error al actualizar datos de un usuario');
      res.redirect(req.headers.referer);
    })
  })
}

controller.baja = function (req, res) {
  User.findByPk(req.params.userId).then(user => {
    user.update({
      allowAccess: false
    }).then(() => {
      req.flash('success_msg', 'Se inactivó el acceso de un usuario correctamente');
      res.redirect(req.headers.referer);
    }).catch(err => {
      req.flash('error_msg', 'Error al inactivar acceso de un usuario');
      res.redirect(req.headers.referer);
    })
  })
}

controller.deshacerBaja = function (req, res) {
  User.findByPk(req.params.userId).then(user => {
    user.update({
      allowAccess: true
    }).then(() => {
      req.flash('success_msg', 'Se reactivó el acceso un usuario correctamente');
      res.redirect(req.headers.referer);
    }).catch(err => {
      req.flash('error_msg', 'Error al reactivar el acceso de alta un usuario');
      res.redirect(req.headers.referer);
    })
  })
}

controller.getMailList = (req, res) => {
  var mailList = []
  User.findAll().then(users => {
    users.forEach(user => {
      mailList.push(user.email)
    });
    res.send({
      mailList
    })
  })
}

controller.delete = function (req, res) {
  UserEmpresa.destroy({
    where: {
      userId: req.params.userId
    }
  }).then(() => {
    User.destroy({
        where: {
          userId: req.params.userId
        }
      }).then(() => {
        req.flash("success_msg", "Se eliminó un usuario correctamente");
        res.redirect("/alumnos");
      })
      .catch(err => {
        console.log(err)
        req.flash("error_msg", "Error al eliminar un usuario");
        res.redirect("/alumnos");
      });
  }).catch(err => {
    console.log(err)
  });
};

controller.sendMail = function (req, res) {
  let email = req.body.email
  email.mensaje += '\n\n\n\n' + req.headers.origin + '\nEquipo FarmERP.\n'

  User.findByPk(req.params.userId).then(user => {
      Mailing.enviarMail(user.email, email.asunto, email.mensaje);
      req.flash('success_msg', 'Se envió retroalimentación a un alumno correctamente');
      res.redirect('/alumnos')
  })
}

module.exports = controller;