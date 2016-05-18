// DOM Ready =============================================================
$(document).ready(function () {
    
    // Populate the user table on initial page load
    populateItemTable();
    
    $("#newitem").click(function () {
        $('#ItemField fieldset input').val('');
        $("#btnAddItem").show();
        $("#btnUpdateItem").hide();
    });

    // Create Item button click
    $('#btnAddItem').on('click', createItem);
    
    // Update Item button click
    $('#btnUpdateItem').on('click', updateItem);

    // Update Item link click
    $('#itemList table tbody').on('click', 'td a.linkupdateitem', fillItemField);

    // Delete Item link click
    $('#itemList table tbody').on('click', 'td a.linkdeleteitem', deleteItem);
});

// Functions =============================================================

// Fill table with data
function populateItemTable() {

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
            tableContent += '<td><a href="#" class="linkupdateitem" rel="' + this._id + '">update</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteitem" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });
        
        // Inject the whole content string into our existing HTML table
        $('#itemList table tbody').html(tableContent);
    });
};

//Create new Item
function createItem(event) {
    event.preventDefault();
    
    // Compile all item info into one object
    var newItem = {
        'name': $('#ItemField fieldset input#Name').val(),
        'description': $('#ItemField fieldset input#Description').val(),
        'imagelink': $('#ItemField fieldset input#Imagelink').val(),
        'size': $('#ItemField fieldset input#Size').val(),
        'color': $('#ItemField fieldset input#Color').val(),
        'price': $('#ItemField fieldset input#Price').val()
    }
    
    // Use AJAX to post the object to our adduser service
    $.ajax({
        type: 'POST',
        data: newItem,
        url: '/items/createitem',
        dataType: 'JSON'
    }).done(function (response) {        
        // Check for successful (blank) response
        if (response.msg === '') {            
            // Clear the form inputs
            $('#ItemField fieldset input').val('');
            
            // Update the table
            populateItemTable();
        }
        else {            
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
};


//update data item
function updateItem() {
    
    event.preventDefault();
    
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to Update this Item?');
    
    // Check and make sure the user confirmed
    if (confirmation === true) {
        var _id = $('#ItemField').attr('rel');
        
        var fieldsToBeUpdated = $('#ItemField input');
        
        var updatedFields = {};
        $(fieldsToBeUpdated).each(function () {
            var key = $(this).attr('placeholder').replace(" ", "").toLowerCase();
            var value = $(this).val();
            updatedFields[key] = value;
        })
        
        $.ajax({
            type: 'PUT',
            url: '/items/updateitem/' + _id,
            data: updatedFields
        }).done(function (response) {
            // Check for a successful (blank) response            
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }            
            // Update the table            
            populateItemTable();
        });

    } else {
        
        // If they said no to the confirm, do nothing
        return false;
    }
};

// Filling Form for Update
function fillItemField(event) {
    event.preventDefault();
    
    //hide create button and show update button
    $("#btnAddItem").hide();
    $("#btnUpdateItem").show();

    // Get Index of object based on _id value    
    var _id = $(this).attr('rel');

    // jQuery AJAX call for JSON
    $.getJSON('/items/item/' + _id, function (data) {
        // Populate Info Box    
        $('#Name').val(data.name);
        $('#Description').val(data.description);
        $('#Imagelink').val(data.imagelink);
        $('#Size').val(data.size);
        $('#Color').val(data.color);
        $('#Price').val(data.price);

        // Put the ID into the REL of the 'update Item' block    
        $('#ItemField').attr('rel', data._id);
    });    
};

// Delete Item
function deleteItem(event) {
    event.preventDefault();
    
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this Item?');
    
    // Check and make sure the user confirmed
    if (confirmation === true) {        
        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/items/deleteitem/' + $(this).attr('rel')
        }).done(function (response) {            

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateItemTable();
        });
    }
    else {        
        // If they said no to the confirm, do nothing
        return false;
    }
};