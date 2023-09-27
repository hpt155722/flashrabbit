const fs = require('fs'); 

function onload() {
    //START ANIMATIONS
    document.getElementById('cloud1').classList.add('slide-left');
    document.getElementById('cloud2').classList.add('slide-right');
    document.getElementById('cloud3').classList.add('slide-left2');
    document.getElementById('rightRabbit').classList.add('slide-bottom');
    document.getElementById('leftRabbit').classList.add('slide-top');

    //HIDE MAIN APP
    document.getElementById('header').style.display = 'none';
    document.querySelector('.entireAlertContainer').style.display = 'none';
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

let setSortBy = 'A-Z';
document.getElementById('selectSortBy').addEventListener('change', function() {
    console.log('changed select');
    var selectedOption = this.value;
    console.log(selectedOption);
    if (selectedOption === 'A-Z') {
        setSortBy = 'A-Z';
    } else if (selectedOption === 'Most Unlearned') {
        setSortBy = 'Most Unlearned';
    }
    readAndDisplay();
});

function updateVariable(selectedOption) {
    // Implement your logic here to update the variable based on the selected option
}

function readAndDisplay()
{
    let total;
    let learned;
    // Read and display sets from set.json
    fetch('sets.json')
        .then(response => response.json())
        .then(data => {
            const dataArray = data; // Assign the fetched data to dataArray
            console.log(dataArray); // Verify if the data is read correctly     
            
            // Sort Sets
            if (setSortBy === 'Most Unlearned') {
                dataArray.sort((a, b) => {
                    const unlearnedA = a.cards.filter(card => !card.learned).length;
                    const unlearnedB = b.cards.filter(card => !card.learned).length;

                    console.log('testa');  // Move this line here
                    return unlearnedB - unlearnedA;
                });
            } else { // Sort by A-Z
                dataArray.sort((a, b) => a.setName.localeCompare(b.setName));
                console.log('testb');  // Move this line here
            }


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
                const stats = calculateSetStats(dataArray, data.setId);
                total = stats ? stats.totalCards : 0;
                learned = stats ? stats.learnedCards : 0;

                const div = createDivForData(data, total, learned);
                container.appendChild(div); 
            });

        
        })
        .catch(error => console.error('Error:', error));
}

function calculateSetStats(dataArray, setId) {
    const set = dataArray.find(set => set.setId === setId);
    if (!set) return null;

    const totalCards = set.cards.length;
    const learnedCards = set.cards.filter(card => card.learned).length;

    return { totalCards, learnedCards };
}

function createDivForData(data, total, learned) {
    const div = document.createElement('div');
    div.classList.add('setContainer'); 
  
    div.innerHTML = `
        <h2> ${data.setName} </h2>
        <p class='learnedCardsInfo'> Learned: ${learned} / ${total}</p>
        <img onclick="openEditSetName('${data.setName}')" class="setEditIcon" src="icons/edit.png">
    `;
  
    return div;
}


// Open Edit Set Name
let currentOpenedSetToEdit;
function openEditSetName(setName) {
    currentOpenedSetToEdit = setName;
    const entireAlertContainer = document.querySelector('.entireAlertContainer');
    entireAlertContainer.classList.add('fade-in');
    entireAlertContainer.style.display = 'block';
    
    setTimeout(function() {
        entireAlertContainer.classList.remove('fade-in');
    }, 500);
}

// Save Edit Set Name
function saveEditSetName() {
    const newName = document.getElementById('changeInput').value; // Get new name
    const curr = currentOpenedSetToEdit;
    console.log("curr: ", curr);
    fetch('sets.json')
        .then(response => response.json())
        .then(data => {
            const dataArray = data; // Assign the fetched data to dataArray

            // Change set name
            dataArray.forEach(data => {
                console.log(typeof data.setName, typeof curr);
                console.log("data.setName:", data.setName);
                console.log("currentOpenedSetToEdit:", curr);

                if (String(data.setName) === String(curr)) 
                {
                    console.log("data.setName before: ",data.setName);
                    data.setName = newName;
                    console.log("data.setName after: ",data.setName);
                }
            });

            // Save data to sets.json file
            try {
                fs.writeFileSync('src/sets.json', JSON.stringify(dataArray));
                readAndDisplay();
                console.log("File written");
            } catch (err) {
                console.error(err);
            }
        })
        .catch(error => console.error('Error:', error));
        closeEditSetName();
}

// Close Edit Set Name
function closeEditSetName() {
    currentOpenedSetToEdit = '';
    const entireAlertContainer = document.querySelector('.entireAlertContainer');
    entireAlertContainer.classList.add('fade-out');

    setTimeout(function() {
        entireAlertContainer.classList.remove('fade-out');
        entireAlertContainer.style.display = 'none';
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
        try {
            fs.writeFileSync('src/sets.json', JSON.stringify(dataArray));
            readAndDisplay();
            console.log("File written");
        } catch (err) {
            console.error(err);
        }

        // Update the displayed sets
        readAndDisplay();
        console.log("File written");
        
        // closeAddSetName();
    } catch (err) {
        console.error(err);
    }
    closeAddSetName();
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
