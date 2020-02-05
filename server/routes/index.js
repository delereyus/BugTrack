// routes/index.js

var express = require("express");
var secured = require("../lib/middleware/secured");
var router = express.Router();

/* GET home page. */
/*router.get('/', secured, function (req, res, next) {
  res.redirect("/index");
});*/

/*router.get('', secured, function (req, res, next) {
  res.redirect("/login");
});*/

module.exports = router;
