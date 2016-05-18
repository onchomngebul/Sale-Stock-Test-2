// DOM Ready =============================================================
$(document).ready(function () {
    
    // Populate the user table on initial page load
    populateCouponTable();
    
    $("#newcoupon").click(function () {
        $('#CouponField fieldset input').val('');
        $("#btnAddCoupon").show();
        $("#btnUpdateCoupon").hide();
    });

    //// Create Item button click
    $('#btnAddCoupon').on('click', createCoupon);
    
    //// Update Item button click
    $('#btnUpdateCoupon').on('click', updateCoupon);

    //// Update Item link click
    $('#couponList table tbody').on('click', 'td a.linkupdateCoupon', fillCouponField);

    //// Delete Item link click
    $('#couponList table tbody').on('click', 'td a.linkdeleteCoupon', deleteCoupon);
});

// Functions =============================================================

// Fill table with data
function populateCouponTable() {
    //declare blank content
    var tableContent = '';
    
    // jQuery AJAX call for JSON
    $.getJSON('/coupons/couponslist', function (data) {
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function () {
            tableContent += '<tr>';
            tableContent += '<td>' + this.title + '</td>';
            tableContent += '<td>' + this.kode + '</td>';
            tableContent += '<td>' + this.minpurchase + '</td>';
            tableContent += '<td>' + this.percent + '</td>';
            tableContent += '<td>' + this.maksdiscount + '</td>';
            tableContent += '<td>' + this.isaktif + '</td>';
            tableContent += '<td><a href="#" class="linkupdateCoupon" rel="' + this._id + '">update</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteCoupon" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });
        
        // Inject the whole content string into our existing HTML table
        $('#couponList table tbody').html(tableContent);
    });
};

//Create new Coupon
function createCoupon(event) {
    event.preventDefault();

    // Compile all item info into one object
    var newCoupon = {
        'title': $('#CouponField fieldset input#Title').val(),
        'kode': $('#CouponField fieldset input#Kode').val(),
        'minpurchase': $('#CouponField fieldset input#Minpurchase').val(),
        'percent': $('#CouponField fieldset input#Percent').val(),
        'maksdiscount': $('#CouponField fieldset input#Maksdiscount').val(),
        'isaktif': $('#CouponField fieldset input#Isaktif').val()
    };
    
    // Use AJAX to post the object to our adduser service
    $.ajax({
        type: 'POST',
        data: newCoupon,
        url: '/coupons/createcoupon',
        dataType: 'JSON'
    }).done(function (response) {        
        // Check for successful (blank) response
        if (response.msg === '') {            
            // Clear the form inputs
            $('#CouponField fieldset input').val('');
            
            // Update the table
            populateCouponTable();
        }
        else {            
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
};


//update data coupon
function updateCoupon() {
    
    event.preventDefault();
    
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to Update this Coupon?');
    
    // Check and make sure the user confirmed
    if (confirmation === true) {
        var _id = $('#CouponField').attr('rel');
        
        var fieldsToBeUpdated = $('#CouponField input');
        
        var updatedFields = {};
        $(fieldsToBeUpdated).each(function () {
            var key = $(this).attr('placeholder').replace(" ", "").toLowerCase();
            var value = $(this).val();
            updatedFields[key] = value;
        })
        
        $.ajax({
            type: 'PUT',
            url: '/coupons/updatecoupon/' + _id,
            data: updatedFields
        }).done(function (response) {
            // Check for a successful (blank) response            
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }
            
            // Clear the form inputs
            //$('#ItemField fieldset input').val('');
            
            // Update the table            
            populateCouponTable();
        });
    } else {
        
        // If they said no to the confirm, do nothing
        return false;
    }
};

// Filling Form for Update
function fillCouponField(event) {
    event.preventDefault();
    
    //hide create button and show update button
    $("#btnAddCoupon").hide();
    $("#btnUpdateCoupon").show();

    // Get Index of object based on _id value    
    var _id = $(this).attr('rel');

    // jQuery AJAX call for JSON
    $.getJSON('/coupons/coupon/' + _id, function (data) {
        // Populate Info Box    
        $('#Title').val(data.title);
        $('#Kode').val(data.kode);
        $('#Minpurchase').val(data.minpurchase);
        $('#Percent').val(data.percent);
        $('#Maksdiscount').val(data.maksdiscount);
        $('#Isaktif').val(data.isaktif);

        // Put the ID into the REL of the 'update Coupon' block    
        $('#CouponField').attr('rel', data._id);
    });    
};

// Delete Item
function deleteCoupon(event) {
    event.preventDefault();
    
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this Coupon?');
    
    // Check and make sure the user confirmed
    if (confirmation === true) {        
        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/coupons/deletecoupon/' + $(this).attr('rel')
        }).done(function (response) {            

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateCouponTable();
        });
    }
    else {        
        // If they said no to the confirm, do nothing
        return false;
    }
};