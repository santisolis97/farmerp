var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');


/* Creditos */
router.get('/', Logged.isLogged, function(req,res){
    res.render('./../views/recursos/creditos/creditos-list')
});




module.exports = router;