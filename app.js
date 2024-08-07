var createError = require('http-errors');
var express = require('express');
var env = require('dotenv').config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var models = require('./models');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var passport = require('passport');
var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var compression = require('compression');
var helmet = require('helmet');

var app = express();

app.use(compression());
app.use(helmet());

app.use(function (req, res, next) {
  if (req.url != '/favicon.ico') {
    return next();
  } else {
    res.status(200);
    res.header('Content-Type', 'image/x-icon');
    res.header('Cache-Control', 'max-age=4294880896');
    //res.header("Cache-Control", "max-age=3600000");
    res.end();
  }
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Sync Database
models.sequelize
  .sync({
    force: false,
  })
  .then(function () {
    /* Borrar cuando se tenga el login y toda la gilada */
    models.User.findByPk(1).then((user) => {
      if (!user) {
        var inicioEjercicio = new Date(2019, 6, 1);
        var finEjercicio = new Date(2020, 5, 30);

        var user1 = {
          nombre: 'Usuario',
          apellido: 'De Prueba',
          email: 'usuario@email.com',
          password: 'usuario',
        };
        var user2 = {
          nombre: 'Admin',
          apellido: 'De Prueba',
          email: 'admin@email.com',
          password: 'admin',
          role: 'admin',
        };
        var empresa = {
          nombre: 'Mi Empre S.A.',
          inicioEjercicio,
          finEjercicio,
        };

        var caja = {
          montoInicial: 0.0,
          empresaId: 1,
        };

        var banco = {
          montoInicial: 0.0,
          empresaId: 1,
        };

        var inversion = {
          montoInicial: 0.0,
          empresaId: 1,
        };
        var agriculturaparametros = {
          iva: 10.5,
          alicuota: 0.0,
          empresaId: 1,
        };
        const cultivoData = {
          nombre: 'Example Cultivo',
          rendimiento: 150.5,
          superficieAsignada: 1110.25,
          precioPizarra: 25.99,
          porcGastosComer: 5.5,
          porcVenta: 80.0,
          porcAlmacenamiento: 7.5,
          porcDobleProposito: 10.0,
          mesventa: 6,
          empresaId: 1,
        };
        models.User.create(user1).then(() => {
          models.Empresa.create(empresa).then((empresa) => {
            models.Cultivo.create(cultivoData);
            models.UserEmpresa.create({
              userId: 1,
              empresaId: 1,
              anioCursado: 2019,
            }),
              models.Caja.create(caja);
            models.Banco.create(banco);
            models.Inversion.create(inversion);
            models.User.create(user2);
            models.parametrosAgricultura.create(agriculturaparametros);
          });
        });
      }
    });
    /* Borrar cuando se tenga el login y toda la gilada */
    console.log('Database Sync OK!');
  })
  .catch(function (err) {
    console.log(err, 'Error to sync database: ' + err);
  });

//app.use(logger('dev'));
/* app.use(express.json());
app.use(express.urlencoded({
  extended: false
})); */
//app.use(express.static("public"));
app.use(cookieParser('keyboard cat'));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true,
    store: new SequelizeStore({
      db: models.sequelize,
    }),
    cookie: {
      maxAge: 4294880896,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.info_msg = req.flash('info_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.empresa = req.empresa || null;
  next();
});

app.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    //console.log(req.user)
    if (req.user.role == 'user') {
      res.redirect('/contable/situacionPatrimonial');
    } else {
      res.redirect('/grupos');
    }
  } else {
    res.render('login');
  }
});

// Routes
require('./routes')(app, passport);

//load passport strategies
require('./config/passport/passport.js')(passport, models.User);

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
