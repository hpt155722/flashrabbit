function onload() {
    //START ANIMATIONS
    document.getElementById('cloud1').classList.add('slide-left');
    document.getElementById('cloud2').classList.add('slide-right');
    document.getElementById('cloud3').classList.add('slide-left2');
    document.getElementById('rightRabbit').classList.add('slide-bottom');
    document.getElementById('leftRabbit').classList.add('slide-top');

    //HIDE MAIN APP
    document.getElementById('header').style.display = 'none';
    document.querySelector('.editSetAlertContainer').style.display = 'none';
    document.querySelector('.addSetAlertContainer').style.display = 'none';
    document.getElementById('allSetsContainerContainer').style.display = 'none';
}

function moveToMain() {
    const cloud1 = document.getElementById('cloud1');
    const cloud2 = document.getElementById('cloud2');
    const cloud3 = document.getElementById('cloud3');
    const rightRabbit = document.getElementById('rightRabbit');
    const leftRabbit = document.getElementById('leftRabbit');
    const cloudBase = document.getElementById('cloudBase');
    const startLearning = document.getElementById('startLearning');

    cloud1.classList.remove('slide-left');
    cloud1.classList.add('slide-out-left');
    cloud2.classList.remove('slide-right');
    cloud2.classList.add('slide-out-top');
    cloud3.classList.remove('slide-left2');
    cloud3.classList.add('slide-out-right');
    rightRabbit.classList.remove('slide-bottom');
    rightRabbit.classList.add('slide-out-top');
    leftRabbit.classList.remove('slide-top');
    leftRabbit.classList.add('slide-out-bottom');
    cloudBase.classList.add('slide-out-bottom');
    startLearning.classList.add('slide-out-top');

    setTimeout(function() {
        cloud1.style.display = 'none';
        cloud1.classList.remove('slide-out-left');
        cloud2.style.display = 'none';
        cloud2.classList.remove('slide-out-top');
        cloud3.style.display = 'none';
        cloud3.classList.remove('slide-out-right');
        rightRabbit.style.display = 'none';
        rightRabbit.classList.remove('slide-out-top');
        leftRabbit.style.display = 'none';
        leftRabbit.classList.remove('slide-out-bottom');
        cloudBase.style.display = 'none';
        cloudBase.classList.remove('slide-out-bottom');
        startLearning.style.display = 'none';
        startVerContainer.style.display = 'none';
        startLearning.classList.remove('slide-out-top');

        document.documentElement.style.overflowY = 'scroll';
        readAndDisplay(); //PREPARE SETS
    }, 800);

    setTimeout(function() {
        document.getElementById('header').style.display = 'block';
        document.getElementById('header').classList.add('slide-in-left');
        document.getElementById('allSetsContainerContainer').style.display = 'flex';
        document.getElementById('allSetsContainerContainer').classList.add('slide-in-right');
    }, 900);

    setTimeout(function() {
        document.getElementById('header').classList.remove('slide-in-left');
        document.getElementById('allSetsContainerContainer').classList.remove('slide-in-right');
    }, 1800);
}

function readAndDisplay()
{
    // Read and display sets from set.json
    fetch('sets.json')
        .then(response => response.json())
        .then(data => {
            const dataArray = data; // Assign the fetched data to dataArray
            console.log(dataArray); // Verify if the data is read correctly

            // Display each data
            const container = document.getElementById('allSetsContainer'); 
            container.innerHTML = `
                <div class="setContainer" style = 'background-color: #b5ccff'>
                    <div class = 'horContainer' style = 'height: 100%'>
                        <div class = 'verContainer'>
                            <h2 onclick = 'openAddSet()'> New set+ </h2>
                        </div>
                    </div>
                </div>
            `;
            dataArray.forEach(data => {
                const div = createDivForData(data);
                container.prepend(div);
            });
        })
        .catch(error => console.error('Error:', error));
}

function createDivForData(data) {
    const div = document.createElement('div');
    div.classList.add('setContainer'); 
  
    div.innerHTML = `
        <h2> ${data.setName} </h2>
        <p class='learnedCardsInfo'> Learned: ${data.learnedCards} / ${data.totalCards}</p>
        <img onclick="openEditSetName('${data.setName}')" class="setEditIcon" src="icons/edit.png">
    `;
  
    return div;
}


// Open Edit Set Name
let currentOpenedSetToEdit;
function openEditSetName(setName) {
    currentOpenedSetToEdit = setName;
    const editSetAlertContainer = document.querySelector('.editSetAlertContainer');
    editSetAlertContainer.classList.add('fade-in');
    editSetAlertContainer.style.display = 'block';
    
    setTimeout(function() {
        editSetAlertContainer.classList.remove('fade-in');
    }, 500);
}

// Save Edit Set Name
function saveEditSetName() {
    event.preventDefault(); 
    const newName = document.getElementById('changeInput').value; // Get new name
    const curr = currentOpenedSetToEdit;
    console.log("curr: ", curr);
    fetch('sets.json')
        .then(response => response.json())
        .then(data => {
            const dataArray = data; // Assign the fetched data to dataArray

            // Change set name
            dataArray.forEach(data => {
                if (data.setName === curr) 
                {
                    data.setName = newName;
                }
            });

            // Save data to sets.json file
            try {
                
                fs.writeFileSync('src/sets.json', JSON.stringify(dataArray));
                readAndDisplay();
            } catch (err) {
                console.error(err);
            }
        })
        .catch(error => console.error('Error:', error));
        closeEditSetName()
}

// Close Edit Set Name
function closeEditSetName() {
    currentOpenedSetToEdit = '';
    const editSetAlertContainer = document.querySelector('.editSetAlertContainer');
    editSetAlertContainer.classList.add('fade-out');

    setTimeout(function() {
        editSetAlertContainer.classList.remove('fade-out');
        editSetAlertContainer.style.display = 'none';
    }, 500);
}

// Open Add Set
function openAddSet() {
    const addSetAlertContainer = document.querySelector('.addSetAlertContainer');
    addSetAlertContainer.classList.add('fade-in');
    addSetAlertContainer.style.display = 'block';
    
    setTimeout(function() {
        addSetAlertContainer.classList.remove('fade-in');
    }, 500);
}

// Save Add Set
function saveAddSet() {
    event.preventDefault(); 
    const newName = document.getElementById('newNameCreated').value; // Get new name

    try {
        const data = fs.readFileSync('src/sets.json'); // Read sets.json
        const dataArray = JSON.parse(data); // Parse JSON data

        // Add a new set with setName as newName to sets.json
        const newSet = {
            "setName": newName,
            "totalCards": 0,
            "learnedCards": 0
        };
        dataArray.push(newSet);

        // Save data to sets.json file
        fs.writeFileSync('src/sets.json', JSON.stringify(dataArray));

        // Update the displayed sets
        readAndDisplay();
        console.log("File written");
        
        // closeAddSetName();
    } catch (err) {
        console.error(err);
    }
}

// Close Add Set
function closeAddSetName() {
    const addSetAlertContainer = document.querySelector('.addSetAlertContainer');
    addSetAlertContainer.classList.add('fade-out');

    setTimeout(function() {
        addSetAlertContainer.classList.remove('fade-out');
        addSetAlertContainer.style.display = 'none';
    }, 500);
}
