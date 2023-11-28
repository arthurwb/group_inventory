$(document).ready(function() {
    // Function to render inventory data
    function renderInventory(data) {
        const inventoryList = $('#inventoryList');
        let total = 0;
        let id = 0;
        inventoryList.empty(); // Clear previous data
    
        if (data) {
            data.forEach(item => {
                total += item.value;
                const listItem = $('<li class="inventory-list-item"></li>').html(`<button id="deleteBtn" class="inventory-item" data-id="${id}">delete</button> <button id="editBtn" class="inventory-item" data-id="${id}">edit</button> Name: ${item.name}, Value: ${item.value}`);
                inventoryList.append(listItem);
                id++;            
            });
    
            // Display the total as a sequence of digits
            const goldTotal = total / 10
            const totalString = goldTotal.toString().split('.');
            $('#total').html(`Total: ${totalString[0]}g and ${totalString[1]}s`);
        } else {
            console.error('Invalid or missing data received.');
        }
    }

    $('#inventoryList').on('click', '#deleteBtn', function() {
        const id = $(this).data('id');
        deleteData(id);
    });
    
    function deleteData(id) {
        $.ajax({
            url: `/deleteData/${id}`, // Use a new route for deletion
            method: 'DELETE',
            success: function(data) {
                console.log(data);
                location.reload(); // Refresh the page after deleting data
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error deleting data:', textStatus, errorThrown);
            }
        });
    }

    $('#inventoryList').on('click', '#editBtn', function() {
        const id = $(this).data('id');
        editData(id);
    });
    
    function editData(id) {
        const newName = prompt('Enter the new name (leave blank to keep the same):');
        const newValue = parseInt(prompt('Enter the new value (leave blank to keep the same):'), 10);
    
        // Send a PUT request to update the data
        $.ajax({
            url: `/editData/${id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ name: newName, value: newValue }),
            success: function(data) {
                console.log(data);
                location.reload(); // Refresh the page after editing data
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error editing data:', textStatus, errorThrown);
            }
        });
    }

    // Function to handle form submission and update JSON data
    $('#updateForm').submit(function(event) {
        event.preventDefault();

        const nameInput = $('#name');
        const valueInput = $('#value');

        const newItem = {
            name: nameInput.val(),
            value: parseInt(valueInput.val(), 10)
        };

        // Send a POST request to updateData API endpoint
        $.ajax({
            url: '/updateData',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ inventory: [newItem] }),
            success: function(data) {
                console.log(data);
                // Refresh the page after updating data (you can implement a more efficient update)
                location.reload();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error updating data:', textStatus, errorThrown);
            }
        });
    });

    // Fetch initial data and render it on page load
    $.get('/getData').done(function(data) {

        // Check if data is present and has the expected structure
        if (data && data.inventoryData) {
            renderInventory(data.inventoryData);
        } else {
            console.error('Invalid or missing data received.');
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error fetching initial data:', textStatus, errorThrown);
    });
});
