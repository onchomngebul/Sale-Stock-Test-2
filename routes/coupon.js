var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Coupon = mongoose.model('Coupon');

/* CRUD Coupon Page*/
router.get('/', function (req, res) {
    res.render('couponlist');
});

/* GET Coupon List page. */
router.get('/couponslist', function (req, res) {
    // get all the Coupon
    Coupon.find({}, function (err, docs) {
        if (err) throw err;
        // object of all the coupon
        res.json(docs);
    });
});

/*
 * POST to Create coupon.
 */
router.post('/createcoupon', function (req, res) {
    
    var data = req.body;
    new Coupon({
        title : data.title,
        kode : data.kode,
        minpurchase : data.minpurchase,
        percent : data.percent,
        maksdiscount : data.maksdiscount,
        isaktif : data.isaktif
    }).save(function (err, result) {
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* GET One data coupon */
router.get('/coupon/:id', function (req, res) {
    Coupon.findById(req.params.id, function (err, data) {
        res.json(data);
    });
});

/* check coupon */
router.get('/checkCoupon/:id', function (req, res) {    
    var kodekupon = req.params.id
    Coupon.findOne({ kode : kodekupon }, function (err, data) {
        if (err) return console.error(err);
        res.json(data);
    });
});

/*
 * PUT to Update coupon.
 */
router.put('/updatecoupon/:id', function (req, res) {
    Coupon.findById(req.params.id, function (err, oldcoupon) {
        var newdata = req.body;
        oldcoupon.title = newdata.title;
        oldcoupon.kode = newdata.kode;
        oldcoupon.minpurchase = newdata.minpurchase;
        oldcoupon.percent = newdata.percent;
        oldcoupon.maksdiscount = newdata.maksdiscount;
        oldcoupon.isaktif = newdata.isaktif;

        oldcoupon.save(function (err, oldcoupon, result) {
            res.send((err === null) ? { msg: '' } : { msg: err });
        });
    });
});

/*
 * DELETE to Delete coupon.
 */
router.delete('/deletecoupon/:id', function (req, res) {
    
    Coupon.findById(req.params.id, function (err, data) {
       data.remove(function (err, data) {
                  res.send((err === null) ? { msg: '' } : { msg: err });    
        });  
    });
});
module.exports = router;