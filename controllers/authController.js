const User = require("./../models").User;
const Empleado = require("./../models").Empleado;
const Mailing = require("../utils/Mailing");
var randtoken = require('rand-token');

const controller = {};

controller.generarCuenta = function (req, res) {
  var reqUser = req.body.usuario;
  var reqEmpleadoId = req.body.empleado.idUser;
  /* if (req.user.role != 'admin') {
    req.flash('error_msg', 'No se tienen los permisos necesarios.');
    return res.redirect('/empleados');
  } */
  return User.create(reqUser).then(user => {
    return Empleado.findById(reqEmpleadoId).then(empleado => {
      return empleado.update({
        idUser: user.idUser
      }).then(empleado => {
        var para = empleado.email;
        var asunto = "Bienvenido!";
        var mensaje = 'Has sido dado de alta en nuestro sistema, ya puedes acceder a tu cuenta con las credenciales proporcionadas por tu administrador.\n\n' +
          'http://' + req.headers.host + '\n\n' +
          'Equipo Fussion Fitness Gym.\n'
        return Mailing.enviarMail(para, asunto, mensaje);
      }).then(() => {
        req.flash('success_msg', 'Se envío correctamente el email de bienvenida al usuario');
        res.redirect('/empleados');
      })
    })
  })
}

controller.cambiarRol = function (req, res) {
  var reqUser = req.body.usuario;
  User.findById(req.params.idUser).then(user => {
    return user.update(reqUser).then(() => {
      req.flash('success_msg', 'Se actualizó el rol de usuario correctamente');
      res.redirect('/empleados');
    })
  }).catch(err => {
    console.log(err)
  })
}

controller.logout = function (req, res) {
  req.session.destroy(function (err) {
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
      req.flash('error_msg', 'No exsiste cuenta con ese email');
      return res.redirect('/auth/forgot');
    }
    var dateExpire = Date.now() + 3600000; // 1 hour
    return user.update({
      resetPasswordToken: token,
      resetPasswordExpires: dateExpire
    }).then(user => {
      var para = user.email;
      var asunto = "Recuperar Contraseña";
      var mensaje = 'Estas recibiendo este mail porque no te acordás tu contraseña.\n\n' +
        'Hacé click en el siguiente enlace, o copialo en el navegador para continuar el proceso de recuperación:\n\n' +
        'http://' + req.headers.host + '/auth/resetpassword/' + token + '\n\n' +
        'Equipo Fussion Fitness Gym. Besito.\n'
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
    console.log('Expires: ' + user.resetPasswordExpires + ', Actual: ' + new Date())
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
  User.findOne({
    where: {
      resetPasswordToken: req.params.token
    }
  }).then(user => {
    if (!user) {
      req.flash('error_msg', 'El enlace para cambio de contraseña no es valido o ha expirado, intente nuevamente.');
      return res.redirect('/auth/forgot');
    }
    console.log('Expires: ' + user.resetPasswordExpires + ', Actual: ' + new Date())
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
      var mensaje = 'Se ha cambiado la contraseña de su cuenta satisfactoriamente.\n\n' +
        'Equipo Fussion Fitnes Gym. Besito.';
      return Mailing.enviarMail(para, asunto, mensaje);
    }).then(() => {
      req.flash('success_msg', 'Se ha cambiado la contraseña satisfactoriamente, ingrese utilizando sus nuevas credenciales');
      return res.redirect('/');
    })
  });
}

module.exports = controller;