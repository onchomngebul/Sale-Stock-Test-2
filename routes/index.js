var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Cart = mongoose.model('Cart');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Bucho Shop' });
});

module.exports = router;