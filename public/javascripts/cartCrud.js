// DOM Ready =============================================================
$(document).ready(function () {
    
    // Populate the item table on initial page load
    populateCartItem();
    
    // delete to cart click
    $('#cartlist table tbody').on('click', 'td a.linkdeletecart', deleteCart);
});

// Functions =============================================================

// Fill table with data
function populateCartItem() {
    //declare blank content
    var tableContent = '';
    
    // jQuery AJAX call for JSON
    $.getJSON('/cart/cartlist', function (data) {
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function () {
            tableContent += '<tr>';
            tableContent += '<td>' + this.buyer + '</td>';
            tableContent += '<td>' + this.address + '</td>';
            tableContent += '<td>' + this.totalitem + '</td>';
            tableContent += '<td>' + this.totalprice + '</td>';
            tableContent += '<td>' + this.totaldiscount + '</td>';
            tableContent += '<td>' + this.totalpayment + '</td>';
            tableContent += '<td><a href="#" class="linkdeletecart" rel="' + this._id + '">Delete</a></td>';
            tableContent += '</tr>';
        });
        
        // Inject the whole content string into our existing HTML table
        $('#cartlist table tbody').html(tableContent);
    });
};

function deleteCart() {
    event.preventDefault();
    
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this Cart?');
    
    // Check and make sure the user confirmed
    if (confirmation === true) {
        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/cart/deletecart/' + $(this).attr('rel')
        }).done(function (response) {
            
            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }
            
            // Update the table
            populateCartItem();
        });
    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }
};
