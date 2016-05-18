var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Item = mongoose.model('Item');

/* CRUD Item Page*/
router.get('/', function (req, res) {
        res.render('itemlist');
});

/* GET Item List page. */
router.get('/itemslist', function (req, res) {
    // get all the Item
    Item.find({}, function (err, docs) {
        if (err) throw err;        
        // object of all the item
        res.json(docs);
    });
});

/*
 * POST to Create Item.
 */
router.post('/createitem', function (req, res) {

    var data = req.body;
    new Item({
        name : data.name,
        description : data.description,
        imagelink : data.imagelink,
        size : data.size,
        color : data.color,
        price : data.price
    }).save(function (err, result) {
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* GET One data item */
router.get('/item/:id', function (req, res) {

    Item.findById(req.params.id, function (err, data) {
        res.json(data);
    });
});

/*
 * PUT to Update Item.
 */
router.put('/updateitem/:id', function (req, res) {
    Item.findById(req.params.id, function (err, olditem) {
        var newdata = req.body;
        olditem.name = newdata.name;
        olditem.description = newdata.description;
        olditem.imagelink = newdata.imagelink;
        olditem.size = newdata.size;
        olditem.color = newdata.color;
        olditem.price = newdata.price;        
        olditem.save(function (err, olditem, result) {
            res.send((err === null) ? { msg: '' } : { msg: err });
        });
    });
});

/*
 * DELETE to Delete Item.
 */
router.delete('/deleteitem/:id', function (req, res) {
    Item.findById(req.params.id, function (err, data) {
        data.remove(function (err, data) {
                  res.send((err === null) ? { msg: '' } : { msg: err });    
        });  
    });
});
module.exports = router;