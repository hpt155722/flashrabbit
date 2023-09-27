const fs = require('fs'); 

function onload() {
    document.documentElement.style.overflowY = 'hidden';
    //START ANIMATIONS
    document.getElementById('cloud1').classList.add('slide-left');
    document.getElementById('cloud2').classList.add('slide-right');
    document.getElementById('cloud3').classList.add('slide-left2');
    document.getElementById('rightRabbit').classList.add('slide-bottom');
    document.getElementById('leftRabbit').classList.add('slide-top');

    //HIDE MAIN APP
    document.getElementById('setsPageHeader').style.display = 'none';
    document.querySelector('.editSetAlertContainer').style.display = 'none';
    document.querySelector('.addSetAlertContainer').style.display = 'none';
    document.getElementById('allSetsContainerContainer').style.display = 'none';

    document.getElementById('flashcardPageHeader').style.display = 'none';
    document.querySelector('.addFlashcardAlertContainer').style.display = 'none';
    document.querySelector('.editFlashcardAlertContainer').style.display = 'none';
    document.getElementById('allFlashcardsContainerContainer').style.display = 'none';
    
    
    
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
        document.getElementById('setsPageHeader').style.display = 'block';
        document.getElementById('setsPageHeader').classList.add('slide-in-left');
        document.getElementById('allSetsContainerContainer').style.display = 'flex';
        document.getElementById('allSetsContainerContainer').classList.add('slide-in-right');
    }, 900);

    setTimeout(function() {
        document.getElementById('setsPageHeader').classList.remove('slide-in-left');
        document.getElementById('allSetsContainerContainer').classList.remove('slide-in-right');
    }, 1800);
}

let setSortBy = 'A-Z';
document.getElementById('setSortBy').addEventListener('change', function() {
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
                    return unlearnedA - unlearnedB;
                });                
            } else { // Sort by A-Z
                dataArray.sort((a, b) => b.setName.localeCompare(a.setName));
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
                container.prepend(div); 
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
        <img id="editIcon-${data.setId}" class="setEditIcon" src="icons/edit.png">
    `;

    //Opens set to view cards
    div.addEventListener('click', function() {
        moveToFlashcards(data.setId, data.setName);
    });

    // Edit Set
    const editIcon = div.querySelector(`#editIcon-${data.setId}`);
    editIcon.addEventListener('click', function(event) {
        event.stopPropagation(); // Stop propagation to prevent the div click event
        openEditSetName(data.setName);
    });

  
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

//FLASHCARD JAVASCRIPT

let currOpenedSetToView;
function moveToFlashcards(setID, setName) {
    currOpenedSetToView = setID;
    document.getElementById('nameOfSetOnFlashcardPage').innerHTML = 'ʚ ♡ ' + setName + ' ♡ ɞ';
    document.getElementById('setsPageHeader').classList.add('slide-out-top');
    document.getElementById('allSetsContainerContainer').classList.add('slide-out-left');
    

    setTimeout(function() {
        document.getElementById('setsPageHeader').style.display = 'none';
        document.getElementById('setsPageHeader').classList.remove('slide-out-top');
        document.getElementById('allSetsContainerContainer').style.display = 'none';
        document.getElementById('allSetsContainerContainer').classList.remove('slide-out-left');

        readAndDisplayCards(); //PREPARE SETS
    }, 800);

    setTimeout(function() {
        document.getElementById('flashcardPageHeader').style.display = 'block';
        document.getElementById('flashcardPageHeader').classList.add('slide-in-right');
        document.getElementById('allFlashcardsContainerContainer').style.display = 'flex';
        document.getElementById('allFlashcardsContainerContainer').classList.add('slide-in-right');
    }, 900);

    setTimeout(function() {
        document.getElementById('flashcardPageHeader').classList.remove('slide-in-right');
        document.getElementById('allFlashcardsContainerContainer').classList.remove('slide-in-right');
    }, 1800);
}

function readAndDisplayCards()
{
    // Read and display sets from set.json
    fetch('sets.json')
        .then(response => response.json())
        .then(data => { 
            const set = data.find(item => item.setId === currOpenedSetToView);
            if (!set) {
                console.error(`Set with ID ${currOpenedSetToView} not found.`);
                return;
            }

            // Sort the cards based on cardSortBy
            if (cardSortBy === 'Unlearned First') {
                set.cards.sort((a, b) => (a.learned && !b.learned) ? -1 : 1);
                
            } else {
                set.cards.sort((a, b) => b.question.localeCompare(a.question));
            }

            // Display each card
            const container = document.getElementById('allFlashcardsContainer'); // Assuming you have a container element with id 'cardsContainer'
            container.innerHTML = `
                <div class="setContainer" style = 'background-color: #b5ccff'>
                    <div class = 'horContainer' style = 'height: 100%'>
                        <div class = 'verContainer'>
                            <h2 onclick = 'openAddCard()'> New card+ </h2>
                        </div>
                    </div>
                </div>
            `;

            set.cards.forEach(card => {
                const cardDiv = createCardDiv(card);
                container.prepend(cardDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}

function createCardDiv(card) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('cardContainer'); 

    if (card.learned) {
        cardDiv.classList.add('learned'); // Add a class if learned is true
    }
  
    let imageElement = ''; // Initialize empty string

    if (card.imgPath) {
        imageElement = `<img class='cardImage' src='${card.imgPath}'>`; // Concatenate imgPath
    }

    cardDiv.innerHTML = `
        <h3> ${card.question} </h3>
        <h4> ${card.answer} </h4>
        <div class = 'horContainer'>
            ${imageElement} 
        </div>
        <p class='learnedText'> Learned: ${card.learned ? '✓' : 'X'} </p>
        <img onclick="openEditCard(${card.cardId})" class="cardEditIcon" src="icons/edit.png">
    `;

    return cardDiv;
}

let cardSortBy = 'A-Z';
document.getElementById('flashcardSortBy').addEventListener('change', function() {
    console.log('changed select');
    var selectedOption = this.value;
    console.log(selectedOption);
    if (selectedOption === 'A-Z') {
        cardSortBy = 'A-Z';
    } else if (selectedOption === 'Unlearned First') {
        cardSortBy = 'Unlearned First';
    }
    readAndDisplayCards();
});

// Open Edit Card
let currentOpenedCardToEdit;
async function openEditCard(cardID) {
    currentOpenedCardToEdit = cardID;
    const editFlashcardAlertContainer = document.querySelector('.editFlashcardAlertContainer');
    editFlashcardAlertContainer.classList.add('fade-in');
    editFlashcardAlertContainer.style.display = 'block';

    //SET CURRENT EDITS AS JSON DATA
    const frontOfCardText = document.getElementById('changedCardQuestion');
    const backOfCardText = document.getElementById('changedCardAnswer');
    
    try {
        const card = await findCardById(currOpenedSetToView, cardID);
        if (card) {
            frontOfCardText.value = card.question;
            backOfCardText.value = card.answer;
        }
    } catch (error) {
        console.error('Error:', error);
    }

    setTimeout(function() {
        editFlashcardAlertContainer.classList.remove('fade-in');
    }, 500);
}

// Function to find a card by its ID
function findCardById(setId, cardId) {
    return fetch('sets.json')
        .then(response => response.json())
        .then(data => { 
            const set = data.find(item => item.setId === setId);
            if (!set) {
                console.error(`Set with ID ${setId} not found.`);
                return null;
            }

            const card = set.cards.find(card => card.cardId === cardId);
            return card || null;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error; // Re-throw the error to be caught by the caller
        });
}

// Save Edit Card
function saveEditFlashcard() {
    const changedCardQuestion = document.getElementById('changedCardQuestion').value; // Get Question
    const changedCardAnswer = document.getElementById('changedCardAnswer').value; // Get Answer

    console.log('currOpenedSetToView: ', currOpenedSetToView);
    console.log('currentOpenedCardToEdit: ', currentOpenedCardToEdit);

    fetch('sets.json')
        .then(response => response.json())
        .then(data => {
            const dataArray = data; // Assign the fetched data to dataArray

            // Find the set and card
            const set = dataArray.find(item => item.setId === currOpenedSetToView);
            if (!set) {
                console.error(`Set with ID ${currOpenedSetToView} not found.`);
                return;
            }

            const card = set.cards.find(card => card.cardId === currentOpenedCardToEdit);
            if (!card) {
                console.error(`Card with ID ${currentOpenedCardToEdit} not found in set ${set.setId}.`);
                return;
            }

            // Update card question and answer
            card.question = changedCardQuestion;
            card.answer = changedCardAnswer;

            // Save data to sets.json file
            try {
                fs.writeFileSync('src/sets.json', JSON.stringify(dataArray));
                readAndDisplayCards();
                console.log("File written");
            } catch (err) {
                console.error(err);
            }
        })
        .catch(error => console.error('Error:', error));

    closeEditFlashcard();
}


// Close Edit Card
function closeEditFlashcard() {
    const editFlashcardAlertContainer = document.querySelector('.editFlashcardAlertContainer');
    editFlashcardAlertContainer.classList.add('fade-out');

    setTimeout(function() {
        editFlashcardAlertContainer.classList.remove('fade-out');
        editFlashcardAlertContainer.style.display = 'none';
    }, 500);
}

function backToSets()
{
    document.getElementById('flashcardPageHeader').classList.add('slide-out-right');
    document.getElementById('allFlashcardsContainerContainer').classList.add('slide-out-right');
    

    setTimeout(function() {
        document.getElementById('flashcardPageHeader').style.display = 'none';
        document.getElementById('flashcardPageHeader').classList.remove('slide-out-right');
        document.getElementById('allFlashcardsContainerContainer').style.display = 'none';
        document.getElementById('allFlashcardsContainerContainer').classList.remove('slide-out-right');

        readAndDisplay(); //PREPARE SETS
    }, 800);

    setTimeout(function() {
        document.getElementById('setsPageHeader').style.display = 'block';
        document.getElementById('setsPageHeader').classList.add('slide-in-left');
        document.getElementById('allSetsContainerContainer').style.display = 'flex';
        document.getElementById('allSetsContainerContainer').classList.add('slide-in-left');
    }, 900);

    setTimeout(function() {
        document.getElementById('setsPageHeader').classList.remove('slide-in-left');
        document.getElementById('allSetsContainerContainer').classList.remove('slide-in-left');
    }, 1800);
}