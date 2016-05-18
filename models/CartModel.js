// grab the things we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var CartSchema = new Schema({
    buyer: String,
    address: String,
    items: [{
            name: String,
            description: String,
            imagelink: String,
            size : Number,
            color : String,
            price : Number
        }],
    totalitem: Number,
    totalprice: Number,
    coupon: {
        title: String,
        percent: String,
    },
    totaldiscount: Number,
    totalpayment: Number
});

// the schema is useless so far
// we need to create a model using it
var Cart = mongoose.model('Cart', CartSchema, 'cartlist');

//mongoose.connect('mongodb://localhost:27017/shopdb');

// make this available to our users in our Node applications
module.exports = Cart;