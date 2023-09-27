function onload()
{
    //START ANIMATIONS
    $('#cloud1').addClass('slide-left');
    $('#cloud2').addClass('slide-right');
    $('#cloud3').addClass('slide-left2');
    $('#rightRabbit').addClass('slide-bottom');
    $('#leftRabbit').addClass('slide-top');

    //HIDE MAIN APP
    $('#header').hide();
    $('.entireAlertContainer').hide();
}

function moveToMain()
{
    $('#cloud1').removeClass('slide-left').addClass('slide-out-left');
    $('#cloud2').removeClass('slide-right').addClass('slide-out-top');
    $('#cloud3').removeClass('slide-left2').addClass('slide-out-right');
    $('#rightRabbit').removeClass('slide-bottom').addClass('slide-out-top');
    $('#leftRabbit').removeClass('slide-top').addClass('slide-out-bottom');
    $('#cloudBase').addClass('slide-out-bottom');
    $('#startLearning').addClass('slide-out-top');

    setTimeout(function() {
        $('#cloud1').hide().removeClass('slide-out-left');
        $('#cloud2').hide().removeClass('slide-out-top');
        $('#cloud3').hide().removeClass('slide-out-right');
        $('#rightRabbit').hide().removeClass('slide-out-top');
        $('#leftRabbit').hide().removeClass('slide-out-bottom');
        $('#cloudBase').hide().removeClass('slide-out-bottom');
        $('#startVerContainer').hide().removeClass('slide-out-top');
        $('html, body').css('overflow-y', 'scroll');
      }, 800);

      setTimeout(function() {
        $('#header').show().addClass('slide-in-left');
      }, 900);

      setTimeout(function() {
        $('#header').removeClass('slide-in-left');

        //Read and display sets from set.json
        let dataArray; // Define dataArray variable
        fetch('sets.json')
            .then(response => response.json())
            .then(data => {
                dataArray = data; // Assign the fetched data to dataArray
                console.log(dataArray); // Verify if the data is read correctly

                //Display each data
                const container = $('#allSetsContainer'); // Assuming you have a container element in your HTML
                dataArray.forEach(data => 
                {
                    const div = createDivForData(data);
                    container.append(div);
                });
            })
            .catch(error => console.error('Error:', error));
      }, 1800);
}

function createDivForData(data) {
    const div = document.createElement('div');
    div.classList.add('setContainer'); // You can add classes for styling if needed
  
    // Assuming data is an object with properties like name, email, age
    div.innerHTML = `
        <h2> ${data.setName} </h2>
        <p class = 'learnedCardsInfo'> Learned: ${data.learnedCards} / ${data.totalCards}</p>
        <img onclick="openEditSetName('${data.setName}')" class="setEditIcon" src="icons/edit.png">
    `;
  
    return div;
}

//Open Edit Set Name
let currentOpenedSetToEdit;
function openEditSetName(setName)
{
    currentOpenedSetToEdit = setName;
    $('.entireAlertContainer').addClass('fade-in').show();
    setTimeout(function() {
        $('.entireAlertContainer').removeClass('fade-in');
    }, 500);

};

//Save Edit Set Name
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

    ipcRenderer.send('save-data', data);

}

//Close Edit Set Name
function closeEditSetName()
{
    currentOpenedSetToEdit = '';
    $('.entireAlertContainer').addClass('fade-out')
    setTimeout(function() {
        $('.entireAlertContainer').removeClass('fade-out').hide();
    }, 500);
};

