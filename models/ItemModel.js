// grab the things we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var ItemSchema = new Schema({
    name: String,
    description: String,
    imagelink: String,
    size : Number,
    color : String,
    price : Number
});

// the schema is useless so far
// we need to create a model using it
var Item = mongoose.model('Item', ItemSchema, 'itemlist');

//mongoose.connect('mongodb://localhost:27017/shopdb');

// make this available to our users in our Node applications
module.exports = Item;