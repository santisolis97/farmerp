var express = require('express');
var router = express.Router();

/* Lotes List */
router.get('/', function(req, res, next) {
  res.render("capital/rodado/rodado-list");
});

module.exports = router;