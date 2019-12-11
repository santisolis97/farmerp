module.exports = function (passport, user) {
  var User = user;
  var LocalStrategy = require('passport-local').Strategy;
 
  passport.serializeUser(function (user, done) {
    done(null, user.userId);
  });
  
  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findByPk(id).then(function (user) {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });
  
  passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) {
      User.findOne({
        where: {
          email: email
        }
      }).then(function (user) {
        if (user) {
          return done(null, false, req.flash('error_msg', 'Este email ya existe'));
        } else {
          User.create({
            email,
            password
          }).then(newUser => {
            if (!newUser) {
              return done(null, false);
            }
            return done(null, newUser);
          });
        }
      });
    }
  ));

  //LOCAL SIGNIN
  passport.use('local-signin', new LocalStrategy({
      passReqToCallback: true,
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) {
      var User = user;
      User.findOne({
        where: {
          email: email
        }
      }).then(user => {
        if (!user || !user.validPassword(password)) {
          return done(null, false, req.flash('error_msg', 'Usuario o contraseña incorrecta.'));
        }
        
        return done(null, user.get());
      }).catch(function (err) {
        console.log("Error:", err);
        return done(null, false, req.flash('error_msg', 'Error al iniciar sesion'));
      });
    }
  ));
}