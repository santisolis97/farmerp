var express = require('express');
var router = express.Router();
const Logged = require('./../utils/logged');


/* Situación Patrimonial */
router.get('/situacionPatrimonial', Logged.isLogged, function(req,res){
    res.render('./../views/contable/situacionPatrimonial')
});




module.exports = router;