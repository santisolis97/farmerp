var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var models = require("./models");
var bodyParser = require("body-parser");
var flash = require("express-flash");
var session = require("express-session");
var env = require("dotenv").load;

var app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



//Sync Database
models.sequelize.sync({
  force: false
}).then(function () {
  /* Borrar cuando se tenga el login y toda la gilada */
  models.User.findByPk(1).then(user => {
    if (!user) {
      var user = {
        nombre: 'Usuario',
        apellido: 'De Prueba',
        mail: 'usuario@mail.com'
      }
      var empresa = {
        nombre: 'Mi Empre S.A.',
        inicioEjercicio: '2019-07-01', 
        finEjercicio: '2020-06-30',
        userId: 1
      }

      var caja = {
        montoInicial: 0.0,
        montoMovimientos: 0.0,
        empresaId: 1
      }

      var banco = {
        montoInicial: 0.0,
        montoMovimientos: 0.0,
        empresaId: 1
      }

      var inversion = {
        montoInicial: 0.0,
        montoMovimientos: 0.0,
        empresaId: 1
      }

      models.User.create(user).then(() => {
        models.Empresa.create(empresa).then(empresa => {
          models.Caja.create(caja)
          models.Banco.create(banco)
          models.Inversion.create(inversion)
        })
      })
    }
  })
  /* Borrar cuando se tenga el login y toda la gilada */
  console.log('Database Sync OK!');
}).catch(function (err) {
  console.log(err, "Error to sync database: " + err);
});

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);
/* 
app.use(passport.initialize());
app.use(passport.session());
*/

app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.info_msg = req.flash("info_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  res.locals.empresa = req.empresa || 'adasdasd';
  next();
});

app.get("/", function (req, res) {
  res.redirect('/lotes');
});

// Routes
require("./routes")(app)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;