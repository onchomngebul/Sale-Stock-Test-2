// DOM Ready =============================================================
$(document).ready(function () {
    
    // Populate the item table on initial page load
    populateShopItem();
    
    // Add to cart click
    $('#shoplist table tbody').on('click', 'td a.linkaddtocart', addtoCart);
    
    
    //remove from cart
    $('#cartitem table tbody').on('click', 'td a.linkremove', removefromCart);

    //buy all button
    $('#BuyAll').on('click', buyyAll);
    
    //populate item in cart
    populateItemInCart()

    //check coupon
    $('#checkCoupon').on('click', cekCoupon);
});

// Functions =============================================================

// Fill table with data
function populateShopItem() {
    //declare blank content
    var tableContent = '';
    
    // jQuery AJAX call for JSON
    $.getJSON('/items/itemslist', function (data) {
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function () {
            tableContent += '<tr>';
            tableContent += '<td>' + this.name + '</td>';
            tableContent += '<td>' + this.description + '</td>';
            tableContent += '<td>' + this.imagelink + '</td>';
            tableContent += '<td>' + this.size + '</td>';
            tableContent += '<td>' + this.color + '</td>';
            tableContent += '<td>' + this.price + '</td>';
            tableContent += '<td><a href="#" class="linkaddtocart" rel="' + this._id + '">ADD to CART</a></td>';
            tableContent += '</tr>';
        });
        
        // Inject the whole content string into our existing HTML table
        $('#shoplist table tbody').html(tableContent);
    });
};

function addtoCart() {
    //get id cart
    var idcart = $('#CartField').attr('rel');
    
    //get data item
    $.getJSON('/items/item/' + $(this).attr('rel'), function (data) {
        
        $.ajax({
            type: 'PUT',
            url: '/cart/additem/' + idcart,
            data: data
        }).done(function (response) {
            // Check for a successful (blank) response         
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }
            
            // Update the table            
            populateItemInCart();
        });

    });
};

function populateItemInCart() {
    //get id cart
    var idcart = $('#CartField').attr('rel');
    
    //declare blank content
    var tableContent = '';
    var totalitem = 0;
    var totalprice = 0;
    var totaldiscount = 0;
    var totalpayment = 0;
    
    // jQuery AJAX call for JSON
    $.getJSON('/cart/onecart/' + idcart, function (data) {
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data.items, function () {
            tableContent += '<tr>';
            tableContent += '<td>' + this.name + '</td>';
            tableContent += '<td>' + this.description + '</td>';
            tableContent += '<td>' + this.imagelink + '</td>';
            tableContent += '<td>' + this.size + '</td>';
            tableContent += '<td>' + this.color + '</td>';
            tableContent += '<td>' + this.price + '</td>';
            tableContent += '<td><a href="#" class="linkremove" rel="' + this._id + '">Remove</a></td>';
            tableContent += '</tr>';
            totalitem++;
            totalprice += this.price;
        });
        // Inject the whole content string into our existing HTML table
        $('#cartitem table tbody').html(tableContent);

        //change data cart
        $('#datacart').html("Total Item : " + totalitem + "  Total Price : " + totalprice);

        $('#totalitem').attr('rel', totalitem);
        $('#totalprice').attr('rel', totalprice);
        
        //get data coupon kodeCoupon
        var kode = $('#kodeCoupon').attr('rel');
        if (kode != null) {            
            $.getJSON('/coupons/checkCoupon/' + $('#kodeCoupon').attr('rel'), function (data) {
                alert("Discount " + data.percent+"%");
                totaldiscount = data.percent * totalprice / 100;
                if (totaldiscount>data.maksdiscount) {
                    totaldiscount = data.maksdiscount;
                }                
                totalpayment = totalprice - totaldiscount;
                //change data discount coupon
                $('#datapayment').html("Total Discount : " + totaldiscount + "  Total Payment : " + totalpayment);
                
                $('#totaldiscount').attr('rel', totaldiscount);
                $('#totalpayment').attr('rel', totalpayment);
            });
        }

        totalpayment = totalprice - totaldiscount;
        //change data discount coupon
        $('#datapayment').html("Total Discount : " + totaldiscount + "  Total Payment : " + totalpayment);
        
        $('#totaldiscount').attr('rel', totaldiscount);
        $('#totalpayment').attr('rel', totalpayment);

        
    });
};

function removefromCart() {
    
    //get id cart
    var idcart = $('#CartField').attr('rel');
    
    //get id item in cart
    var iditemincart = $(this).attr('rel');

    $.ajax({
        type: 'PUT',
        url: '/cart/removefromcart/' + idcart,
        data: iditemincart
    }).done(function (response) {
        // Check for a successful (blank) response         
        if (response.msg === '') {
        }
        else {
            alert('Error: ' + response.msg);
        }
        
        // Update the table            
        populateItemInCart();
    });
};

function buyyAll() {
    event.preventDefault();

    //get id cart
    var idcart = $('#CartField').attr('rel');
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to Buy All this Item?');
    
    // Check and make sure the user confirmed
    if (confirmation === true) {
        //compile needed data
        var updatedCart = {
            'buyer': $('input#Buyer').val(),
            'address': $('input#Address').val(),
            'totalitem': $('#totalitem').attr('rel'),
            'totalprice': $('#totalprice').attr('rel'),
            'totaldiscount': $('#totaldiscount').attr('rel'),
            'totalpayment': $('#totalpayment').attr('rel'),
        }

        $.ajax({
            type: 'PUT',
            url: '/cart/buyall/' + idcart,
            data: updatedCart
        }).done(function (response) {
            // Check for a successful (blank) response            
            if (response.msg === '') {
                alert("Buy Success, Thanks For Comming");
            }
            else {
                alert('Error: ' + response.msg);
            }
        });
    }
};

function cekCoupon() {
    event.preventDefault();
    
    var kodekupon = $('input#Kode').val();

    // jQuery AJAX call for JSON
    $.getJSON('/coupons/checkCoupon/' + kodekupon, function (data) {
        if (data == null) {
            alert("Code Coupon Undefined");
        } else { 
            //get total price
            var totalprice = $('#totalprice').attr('rel');
            
            //validating minimal purchase
            if (totalprice < data.minpurchase) {
                alert("minpurchase Unreached");
            } else {
                alert("Code Coupon Validated and will be used");
                $('#kodeCoupon').attr('rel', data.kode);
                //recalculated
                populateItemInCart();
            }
        }        
        
    });
};