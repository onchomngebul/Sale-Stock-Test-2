var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Cart = mongoose.model('Cart');

/* Create blank Cart*/
router.get('/', function (req, res) {
    new Cart({
    }).save(function (err, result) {
        res.render('shop', {
            title: 'Bucho Shop',
            iniID: result._id
        });
    });

});

///*
// * Cancel Order
// */
//router.delete('/cancelorder/:id', function (req, res) {
//    Cart.findById(req.params.id, function (err, data) {
//        data.remove(function (err, data) {
//                  res.redirect(index, '/');    
//        });  
//    });
//});

/* GET Cart List . */
router.get('/cartlist', function (req, res) {
    // get all the Cart
    Cart.find({}, function (err, docs) {
        if (err) throw err;
        // object of all the Cart
        res.json(docs);
    });
});

/*
 * POST to Create Cart.
 */
router.post('/createcart', function (req, res) {
    
    var data = req.body;
    new Cart({
        buyer : data.buyer,
        address : data.address,
    }).save(function (err, result) {
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

//add item to cart
router.put('/additem/:id', function (req, res) {
    var newitem = {
        name : req.body.name,
        description : req.body.description,
        imagelink : req.body.imagelink,
        size : req.body.size,
        color : req.body.color,
        price : req.body.price
    }

    Cart.findByIdAndUpdate(
        req.params.id, 
        { $push: { "items": newitem } },
        { safe: true, upsert: true },
        function (err, datacart) {
            //datacart.save(function (err, datacart, result) {
                res.send((err === null) ? { msg: '' } : { msg: err });
            //});
            
        }
    );
});

//remove item from cart
router.put('/removefromcart/:id', function (req, res) {
    var itemtoremove = req.body;

    Cart.findByIdAndUpdate(
        req.params.id, 
        { $pull: { "items": { _id: itemtoremove } } },
        { safe: true, upsert: true },
        function (err, datacart) {
            //datacart.save(function (err, datacart, result) {
            res.send((err === null) ? { msg: '' } : { msg: err });
            //});
            
        }
    );
});

/* GET One data Cart */
router.get('/onecart/:id', function (req, res) {
    
    Cart.findById(req.params.id, function (err, data) {
        res.json(data);
    });
});

/*
 * PUT to Update Cart.
 */
router.put('/buyall/:id', function (req, res) {
    Cart.findById(req.params.id, function (err, oldcart) {
        var newdata = req.body;

        oldcart.buyer = newdata.buyer;
        oldcart.address = newdata.address;
        oldcart.totalitem = newdata.totalitem;
        oldcart.totalprice = newdata.totalprice;
        oldcart.totaldiscount = newdata.totaldiscount;
        oldcart.totalpayment = newdata.totalpayment;

        oldcart.save(function (err, oldcart, result) {
            res.send((err === null) ? { msg: '' } : { msg: err });
        });
    });
});


/*
 * DELETE to Delete Cart.
 */
router.delete('/deletecart/:id', function (req, res) {
    Cart.findById(req.params.id, function (err, data) {
        data.remove(function (err, data) {
                  res.send((err === null) ? { msg: '' } : { msg: err });    
        });  
    });
});

module.exports = router;