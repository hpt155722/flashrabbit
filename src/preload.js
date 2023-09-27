//Renderer processs
const {ipcRenderer } = require("electron");

function saveEditSetName()
{
    const newName = $('#changeInput').val(); //Get new name

    let dataArray; // Define dataArray variable
    fetch('sets.json')
        .then(response => response.json())
        .then(data => {
            dataArray = data; // Assign the fetched data to dataArray

            //Change set name
            if (data.setName === currentOpenedSetToEdit) {
                data.setName = newName;
            }
        })
        .catch(error => console.error('Error:', error));
        
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('save-data', data);

}