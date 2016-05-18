// grab the things we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var CouponSchema = new Schema({
    title: String,
    kode: String,
    minpurchase: Number,
    percent : Number,
    maksdiscount : Number,
    isaktif : Boolean
});

// the schema is useless so far
// we need to create a model using it
var Coupon = mongoose.model('Coupon', CouponSchema, 'couponlist');

mongoose.connect('mongodb://localhost:27017/shopdb');

// make this available to our users in our Node applications
module.exports = Coupon;