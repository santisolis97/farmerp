var authController = require('../controllers/authController.js');
var express = require("express");
var passport = require("passport");
var logged = require("../utils/logged");
var router = express.Router();
var flash = require("express-flash");

router.get('/logout', authController.logout);

/* GET login page. */
router.get('/', function (req, res) {
  // Display the Login page with any flash message, if any
  res.render('login', {
    message: req.flash('error_msg')
  });
});

router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true
}))

router.get('/forgot', authController.forgot);

router.get('/forgot/:email', authController.forgot);

router.post('/forgot', authController.forgotRes);

router.get('/resetpassword/:token', authController.reset);

router.post('/resetpassword/:token', authController.resetRes);

router.post('/edit/:userId', logged.isLogged, authController.edit);

router.post('/baja/:userId', logged.isLogged, authController.baja);

router.post('/deshacerBaja/:userId', logged.isLogged, authController.deshacerBaja);

router.get('/api/getMailList', logged.isLogged, authController.getMailList);

module.exports = router;