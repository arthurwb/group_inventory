const express = require('express');
const path = require('path');
const editJsonFile = require('edit-json-file');

const app = express();
const port = 8080;

app.use(express.json()); // Enable JSON body parsing

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

const jsonFilePath = path.join(__dirname, 'data', 'inventory_data.json');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/getData', (req, res) => {
    const file = editJsonFile(jsonFilePath);
    const inventoryData = file.get('inventory') || [];
    res.json({ inventoryData }); // Return JSON data
});

// API endpoint to update JSON data
app.post('/updateData', (req, res) => {
    const newData = req.body;

    const file = editJsonFile(jsonFilePath);
    file.append('inventory', { "name": newData.inventory[0].name, "value": newData.inventory[0].value});
    file.save();

    res.json({ success: true, message: 'Data updated successfully' });
});

app.delete('/deleteData/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    const file = editJsonFile(jsonFilePath);
    const inventoryData = file.get('inventory') || [];

    if (id >= 0 && id < inventoryData.length) {
        // Remove the item at the specified index
        inventoryData.splice(id, 1);

        // Save the modified data back to the JSON file
        file.set('inventory', inventoryData);
        file.save();

        res.json({ success: true, message: 'Data deleted successfully' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid ID for deletion' });
    }
});

app.put('/editData/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name, value } = req.body;

    const file = editJsonFile(jsonFilePath);
    const inventoryData = file.get('inventory') || [];

    if (id >= 0 && id < inventoryData.length) {
        // Update the item at the specified index
        if (name == "") {
            inventoryData[id].name = inventoryData[id].name;
        } else {
            inventoryData[id].name = name;
        }
        if (value == undefined) {
            inventoryData[id].value = inventoryData[id].value;
        } else {
            inventoryData[id].value = value;
        }

        // Save the modified data back to the JSON file
        file.set('inventory', inventoryData);
        file.save();

        res.json({ success: true, message: 'Data edited successfully' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid ID for editing' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
