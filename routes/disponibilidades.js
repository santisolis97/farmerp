var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');


/* Disponibilidades */
router.get('/', Logged.isLogged, function(req,res){
    res.render('./../views/recursos/disponibilidades')
});




module.exports = router;