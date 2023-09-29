const fs = require('fs'); 
const path = require('path');
const { setTimeout } = require('timers');
const { v4: uuidv4 } = require('uuid');


function onload() {
    document.documentElement.style.overflowY = 'hidden';

    document.querySelector('.pinkCover').style.display = 'block';
    document.querySelector('.logo').style.display = 'none';

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
    document.getElementById('quizOptionContainer').style.display = 'none';

    document.getElementById('flashcardPageHeader').style.display = 'none';
    document.querySelector('.addFlashcardAlertContainer').style.display = 'none';
    document.querySelector('.editFlashcardAlertContainer').style.display = 'none';
    document.getElementById('allFlashcardsContainerContainer').style.display = 'none';
    document.getElementById('entireQuizContainer').style.display = 'none';
    document.getElementById('backToFlashcardsButton').style.display = 'none';

    
    //logo
    setTimeout(() => {
        document.querySelector('.logo').style.display = 'block';
        document.querySelector('.logo').classList.add('flip-in-hor-bottom');
    }, 500);
    
    setTimeout(() => {
        document.querySelector('.logo').classList.remove('flip-in-hor-bottom');
        document.querySelector('.logo').classList.add('flip-out-hor-bottom');
    }, 1500);

    setTimeout(() => {
        document.querySelector('.pinkCover').classList.add('fade-out');
        document.querySelector('.logo').style.display = 'none';
        document.querySelector('.logo').classList.remove('flip-out-hor-bottom');
    }, 2300);

    setTimeout(() => {

        document.querySelector('.pinkCover').style.display = 'none';
        document.querySelector('.pinkCover').classList.remove('fade-out');
    }, 2800);
    

    
    
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
    }, 300);

    setTimeout(function() {
        document.getElementById('setsPageHeader').style.display = 'block';
        document.getElementById('setsPageHeader').classList.add('slide-in-left');
        document.getElementById('allSetsContainerContainer').style.display = 'flex';
        document.getElementById('allSetsContainerContainer').classList.add('slide-in-right');
    }, 400);

    setTimeout(function() {
        document.getElementById('setsPageHeader').classList.remove('slide-in-left');
        document.getElementById('allSetsContainerContainer').classList.remove('slide-in-right');
    }, 700);
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
    if (!set) {
        console.error(`Set with ID ${setId} not found.`);
        return null;
    }

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
        openEditSetName(data.setId);
    });

  
    return div;
}

// Open Edit Set Name
let currentOpenedSetToEdit;
function openEditSetName(setID) {
    document.getElementById('saveEditSetName').style.display = 'block';
    currentOpenedSetToEdit = setID;
    const editSetAlertContainer = document.querySelector('.editSetAlertContainer');
    editSetAlertContainer.classList.add('fade-in');
    editSetAlertContainer.style.display = 'block';
    
    setTimeout(function() {
        editSetAlertContainer.classList.remove('fade-in');
    }, 500);
}

// Save Edit Set Name
function saveEditSetName() {
    const curr = currentOpenedSetToEdit;
    // Make sure we cannot click twice
    document.getElementById('saveEditSetName').style.display = 'none';

    const newName = document.getElementById('changeInput').value; // Get new name
    fetch('sets.json')
        .then(response => response.json())
        .then(data => {
            const dataArray = data; // Assign the fetched data to dataArray
            
            dataArray.forEach(set => { // Changed variable name from data to set
                if (set.setId === curr) {
                    console.log('true');
                    set.setName = newName;
                }
            });

            // Save data to sets.json file
            try {
                fs.writeFileSync('src/sets.json', JSON.stringify(dataArray));
                console.log("File written");

                // Move readAndDisplay inside here
                readAndDisplay();
            } catch (err) {
                console.error(err);
            }
        })
        .catch(error => console.error('Error:', error));

        closeEditSetName();
}

//Delete Set
function deleteSet() {
    try {
        const data = fs.readFileSync('src/sets.json'); // Read sets.json
        let dataArray = JSON.parse(data); // Parse JSON data

        // Find the index of the set to delete
        const setIndex = dataArray.findIndex(set => set.setId === currentOpenedSetToEdit);

        if (setIndex !== -1) {
            // Remove all cards from the set
            dataArray[setIndex].cards = [];

            // Remove the set from the array
            dataArray.splice(setIndex, 1);

            // Save data back to sets.json file
            try {
                fs.writeFileSync('src/sets.json', JSON.stringify(dataArray));
                console.log(`Set with ID ${currentOpenedSetToEdit} deleted.`);
                readAndDisplay();
            } catch (err) {
                console.error(err);
            }
        } else {
            console.error(`Set with ID ${currentOpenedSetToEdit} not found.`);
        }
    } catch (err) {
        console.error(err);
    }
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
    document.getElementById('saveChanged').style.display = 'block';
    const addSetAlertContainer = document.querySelector('.addSetAlertContainer');
    addSetAlertContainer.classList.add('fade-in');
    addSetAlertContainer.style.display = 'block';
    
    setTimeout(function() {
        addSetAlertContainer.classList.remove('fade-in');
    }, 500);
}

// Save Add Set
function saveAddSet() {
    //Make sure we cannot click twice
    document.getElementById('saveChanged').style.display = 'none';

    const newName = document.getElementById('newNameCreated').value; // Get new name

    try {
        const data = fs.readFileSync('src/sets.json'); // Read sets.json
        const dataArray = JSON.parse(data); // Parse JSON data

        // Get the next set ID
        const newSetId = getNextSetId(dataArray);

        // Add a new set with setName as newName to sets.json
        const newSet = {
            "setId": newSetId,
            "setName": newName,
            "totalCards": 0,
            "learnedCards": 0,
            "cards": []
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

    } catch (err) {
        console.error(err);
    }
    closeAddSetName();
}


//Auto increment setID
function getNextSetId(dataArray) {
    let maxSetId = 0;

    for (const set of dataArray) {
        if (set.setId > maxSetId) {
            maxSetId = set.setId;
        }
    }

    return maxSetId + 1;
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

// *:･ﾟ✧*:･ﾟ✧ FLASHCARD JAVASCRIPT *:･ﾟ✧*:･ﾟ✧

let currOpenedSetToView; //For card view
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
    }, 300);

    setTimeout(function() {
        document.getElementById('flashcardPageHeader').style.display = 'block';
        document.getElementById('flashcardPageHeader').classList.add('slide-in-right');
        document.getElementById('allFlashcardsContainerContainer').style.display = 'flex';
        document.getElementById('allFlashcardsContainerContainer').classList.add('slide-in-right');
        document.getElementById('quizOptionContainer').style.display = 'flex';
        document.getElementById('quizOptionContainer').classList.add('slide-in-right');
    }, 350);

    setTimeout(function() {
        document.getElementById('flashcardPageHeader').classList.remove('slide-in-right');
        document.getElementById('allFlashcardsContainerContainer').classList.remove('slide-in-right');
        document.getElementById('quizOptionContainer').classList.remove('slide-in-right');
    }, 650);
}

//Read and Display Cards
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
                    <div onclick = 'openAddCard()' class = 'horContainer' style = 'height: 100%;'>
                        <div class = 'verContainer'>
                            <h2> New card+ </h2>
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

//Create a card (for iteration)
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
        
        <div style = 'display: flex; flex-direction: column;text-align: left;'>
            <h3> ${card.question} </h3>
            <h4> ${card.answer} </h4>
        </div>
        <div class = 'horContainer'>
            ${imageElement}
        </div>
        <div style = 'width: 90%; height: 7vh;' play: flex; justify-content: space-between;> 
            <div class = 'learnedBox' style = 'display: flex'>
                <p class='learnedText' style = 'text-align: left'> Learned: </p>
                <div class = 'verContainer'>
                    <input type='checkbox' class = 'smallerCheckbox' ${card.learned ? 'checked' : ''} onclick='toggleLearned(${card.cardId})'>
                </div>
            </div>
            <img onclick="openEditCard(${card.cardId})" class="cardEditIcon" src="icons/edit.png" style = 'text-align: right'> 
        </div>
    `;

    return cardDiv;
}

function toggleLearned(cardId) {
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

            const card = set.cards.find(card => card.cardId === cardId);
            if (!card) {
                console.error(`Card with ID ${cardId} not found in set ${set.setId}.`);
                return;
            }

            // Update card question and answer
            if (card.learned === false)
            {
                card.learned = true;
            }
            else
            {
                card.learned = false;
            }

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
function openEditCard(cardID) {
    document.getElementById('dragDropInstruct').innerHTML = 'Drag & drop an image here to upload';
    currentOpenedCardToEdit = cardID;
    const editFlashcardAlertContainer = document.querySelector('.editFlashcardAlertContainer');
    editFlashcardAlertContainer.classList.add('fade-in');
    editFlashcardAlertContainer.style.display = 'block';

    //SET CURRENT EDITS PLACEHOLDERS AS JSON DATA
    fetch('sets.json')
    .then(response => response.json())
    .then(data => {
        const dataArray = data; // Assign the fetched data to dataArray

        // Find the set with matching setID
        const targetSet = dataArray.find(item => item.setId === currOpenedSetToView);

        if (targetSet) {
            // Find the card with matching cardID in the target set
            const targetCard = targetSet.cards.find(card => card.cardId === currentOpenedCardToEdit);

            if (targetCard) {
                const cardQuestion = targetCard.question;
                const cardAnswer = targetCard.answer;

                // Now you have cardQuestion and cardAnswer available
                document.getElementById('changedCardQuestion').value = cardQuestion;
                document.getElementById('changedCardAnswer').value = cardAnswer;
            } else {
                console.error(`Card with ID ${currentOpenedCardToEdit} not found in the target set.`);
            }
        } else {
            console.error(`Set with ID ${currOpenedSetToView} not found.`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });


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
            return { set, card } || null;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error; // Re-throw the error to be caught by the caller
        });
}

//Event listener for image input editting
let currentUploadedImageFileToChange;
function parseImageToFileTypeToChange(files) {
    currentUploadedImageFileToChange = files;
    document.getElementById('dragDropInstruct').innerHTML = 'Image Received';
}

//Drag and Drop Edit Card Event Listeners
const dropZone = document.getElementById('dropZone');

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const files = e.dataTransfer.files;
  parseImageToFileTypeToChange(files);
});

//Event listener for image input Adding
let currentUploadedImageFileToAdd;
function parseImageToFileTypeToAdd(files) {
    currentUploadedImageFileToAdd = files;
    document.getElementById('dragDropInstructAdd').innerHTML = 'Image Received';
}

//Drag and Drop Add Card Event Listeners
const dropZoneAdd = document.getElementById('dropZoneAdd');

dropZoneAdd.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZoneAdd.classList.add('dragover');
});

dropZoneAdd.addEventListener('dragleave', () => {
    dropZoneAdd.classList.remove('dragover');
});

dropZoneAdd.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZoneAdd.classList.remove('dragover');
  const files = e.dataTransfer.files;
  parseImageToFileTypeToAdd(files);
});

//Remove Image
function remove() {
    try {
        const data = fs.readFileSync('src/sets.json'); // Read sets.json
        let dataArray = JSON.parse(data); // Parse JSON data

        // Find the index of the set to edit
        const setIndex = dataArray.findIndex(set => set.setId === currOpenedSetToView);

        if (setIndex !== -1) {
            const set = dataArray[setIndex];
            const cardIndex = set.cards.findIndex(card => card.cardId === currentOpenedCardToEdit);

            if (cardIndex !== -1) {
                // Delete the original image if it exists
                if (set.cards[cardIndex].imgPath) {
                    fs.unlink(set.cards[cardIndex].imgPath, (err) => {
                        if (err) console.error('Error deleting original image:', err);
                        console.log('Original image deleted successfully');
                    });
                }

                // Remove the imgPath property from the card
                delete set.cards[cardIndex].imgPath;

                // Save data back to sets.json file
                try {
                    fs.writeFileSync('src/sets.json', JSON.stringify(dataArray));
                    console.log(`Card with ID ${currentOpenedCardToEdit} deleted from set ${currOpenedSetToView}.`);
                    readAndDisplayCards();
                } catch (err) {
                    console.error(err);
                }
            } else {
                console.error(`Card with ID ${currentOpenedCardToEdit} not found in set ${currentOpenedSetToEdit}.`);
            }
        } else {
            console.error(`Set with ID ${currentOpenedSetToEdit} not found.`);
        }
    } catch (err) {
        console.error(err);
    }
    closeEditFlashcard();
}

// Save Edit Card
function saveEditFlashcard() {
    const changedCardQuestion = document.getElementById('changedCardQuestion').value; // Get Question
    const changedCardAnswer = document.getElementById('changedCardAnswer').value; // Get Answer

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
            
            let imagePath;
            let uniqueFileName;

            if (currentUploadedImageFileToChange && currentUploadedImageFileToChange !== '') 
            {
                const file = currentUploadedImageFileToChange[0];
                uniqueFileName = `${uuidv4()}-${currentUploadedImageFileToChange.name}`;
                imagePath = path.join(__dirname, 'cardImages', uniqueFileName);
        
                fs.copyFile(file.path, imagePath, (err) => {
                    if (err) throw err;
                    console.log('New image copied successfully');
                    
                    // Delete the original image
                    if (card.imgPath) {
                        fs.unlink(card.imgPath, (err) => {
                            if (err) console.error('Error deleting original image:', err);
                            console.log('Original image deleted successfully');
                        });
                    }
        
                    // Update card question and answer
                    card.question = changedCardQuestion;
                    card.answer = changedCardAnswer;
                    card.imgPath = imagePath; // Update imgPath with the new path
        
                    // Save data to sets.json file
                    try {
                        fs.writeFileSync('src/sets.json', JSON.stringify(dataArray));
                        readAndDisplayCards();
                        console.log("File written");
                    } catch (err) {
                        console.error(err);
                    }
                });
            } else {
                // If no new image is uploaded, update card question and answer only
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
            }
        
            closeEditFlashcard();        
        }); 
}

//Delete Card
function deleteCard() {
    try {
        const data = fs.readFileSync('src/sets.json'); // Read sets.json
        let dataArray = JSON.parse(data); // Parse JSON data

        // Find the index of the set to edit
        const setIndex = dataArray.findIndex(set => set.setId === currOpenedSetToView);

        if (setIndex !== -1) {
            const set = dataArray[setIndex];
            const cardIndex = set.cards.findIndex(card => card.cardId === currentOpenedCardToEdit);

            if (cardIndex !== -1) {
                // Remove the card from the cards array
                set.cards.splice(cardIndex, 1);

                // Save data back to sets.json file
                try {
                    fs.writeFileSync('src/sets.json', JSON.stringify(dataArray));
                    console.log(`Card with ID ${currentOpenedCardToEdit} deleted from set ${currentOpenedSetToEdit}.`);
                    readAndDisplayCards();
                } catch (err) {
                    console.error(err);
                }
            } else {
                console.error(`Card with ID ${currentOpenedCardToEdit} not found in set ${currentOpenedSetToEdit}.`);
            }
        } else {
            console.error(`Set with ID ${currentOpenedSetToEdit} not found.`);
        }
    } catch (err) {
        console.error(err);
    }
    closeEditFlashcard();
}

// Close Edit Card
function closeEditFlashcard() {
    const editFlashcardAlertContainer = document.querySelector('.editFlashcardAlertContainer');
    editFlashcardAlertContainer.classList.add('fade-out');
    currentUploadedImageFileToChange = '';

    setTimeout(function() {
        editFlashcardAlertContainer.classList.remove('fade-out');
        editFlashcardAlertContainer.style.display = 'none';
    }, 500);
}

// Open Add Card
function openAddCard() {
    const addFlashcardAlertContainer = document.querySelector('.addFlashcardAlertContainer');
    addFlashcardAlertContainer.classList.add('fade-in');
    addFlashcardAlertContainer.style.display = 'block';
    
    document.getElementById('newCardQuestion').value = '';
    document.getElementById('newCardAnswer').value = '';
    document.getElementById('newCardQuestion').placeholder = 'enter a question';
    document.getElementById('newCardAnswer').placeholder = 'enter an answer';

    setTimeout(function() {
        addFlashcardAlertContainer.classList.remove('fade-in');
    }, 500);
}

// Save Add Card
function saveAddCard() {
    const newCardQuestion = document.getElementById('newCardQuestion').value; // Get new question
    const newCardAnswer = document.getElementById('newCardAnswer').value; // Get new answer
    //Saving image
        
    try {
        const data = fs.readFileSync('src/sets.json'); // Read sets.json
        const dataArray = JSON.parse(data); // Parse JSON data

        // Find the set within dataArray that matches currOpenedSetToView
        const setToUpdate = dataArray.find(set => set.setId === currOpenedSetToView);

        if (setToUpdate) {
            let imagePath;
            let uniqueFileName;
            if (currentUploadedImageFileToAdd && currentUploadedImageFileToAdd != '')
            {
                const file = currentUploadedImageFileToAdd[0];
                // Generate a unique filename using UUID
                uniqueFileName = `${uuidv4()}-${currentUploadedImageFileToAdd.name}`;
                imagePath = path.join(__dirname, 'cardImages', uniqueFileName);

                // Copy the file to the specified folder
                fs.copyFile(file.path, imagePath, (err) => {
                    if (err) throw err;
                    
                });
            }
            
            // Generate a new card ID (You may need to implement a proper ID generation logic)
            const newCardId = generateNewCardId(setToUpdate);

            // Create the new card object
            const newCard = {
                "answer": newCardAnswer,
                "cardId": newCardId,
                "learned": false,
                "question": newCardQuestion,
            };
            
            if (currentUploadedImageFileToAdd && currentUploadedImageFileToAdd !== '') {
                newCard.imgPath = imagePath;
            }

            // Push the new card to the cards array of the set
            setToUpdate.cards.push(newCard);

            // Save data to sets.json file
            try {
                fs.writeFileSync('src/sets.json', JSON.stringify(dataArray));
                readAndDisplay();
                console.log("File written");
            } catch (err) {
                console.error(err);
            }

            // Update the displayed sets
            readAndDisplayCards();
            console.log("File written");
        } else {
            console.error(`Set with ID ${currOpenedSetToView} not found.`);
        }
    } catch (err) {
        console.error(err);
    }

    closeAddCard();
}

//Auto increment card IDs
function generateNewCardId(set) {
    let maxCardId = 0;

    // Find the highest card ID in the set
    for (const card of set.cards) {
        if (card.cardId > maxCardId) {
            maxCardId = card.cardId;
        }
    }

    // Increment the highest card ID to generate a new unique ID
    return maxCardId + 1;
}

// Close Add Card
function closeAddCard() {
    const addFlashcardAlertContainer = document.querySelector('.addFlashcardAlertContainer');
    addFlashcardAlertContainer.classList.add('fade-out');
    currentUploadedImageFileToAdd = '';
    setTimeout(function() {
        addFlashcardAlertContainer.classList.remove('fade-out');
        addFlashcardAlertContainer.style.display = 'none';
    }, 500);
}

//Move Back to Sets
function backToSets()
{
    document.getElementById('flashcardPageHeader').classList.add('slide-out-right');
    document.getElementById('allFlashcardsContainerContainer').classList.add('slide-out-right');
    document.getElementById('quizOptionContainer').classList.add('slide-out-right');
    

    setTimeout(function() {
        document.getElementById('flashcardPageHeader').style.display = 'none';
        document.getElementById('flashcardPageHeader').classList.remove('slide-out-right');
        document.getElementById('quizOptionContainer').style.display = 'none';
        document.getElementById('quizOptionContainer').classList.remove('slide-out-right');
        document.getElementById('allFlashcardsContainerContainer').style.display = 'none';
        document.getElementById('allFlashcardsContainerContainer').classList.remove('slide-out-right');

        readAndDisplay(); //PREPARE SETS
    }, 300);

    setTimeout(function() {
        document.getElementById('setsPageHeader').style.display = 'block';
        document.getElementById('setsPageHeader').classList.add('slide-in-left');
        document.getElementById('allSetsContainerContainer').style.display = 'flex';
        document.getElementById('allSetsContainerContainer').classList.add('slide-in-left');
    }, 400);

    setTimeout(function() {
        document.getElementById('setsPageHeader').classList.remove('slide-in-left');
        document.getElementById('allSetsContainerContainer').classList.remove('slide-in-left');
    }, 700);
}

// *:･ﾟ✧*:･ﾟ✧ QUIZ JAVASCRIPT *:･ﾟ✧*:･ﾟ✧

function moveToQuiz()
{
    document.getElementById('flashcardPageHeader').classList.add('slide-out-left');
    document.getElementById('quizOptionContainer').classList.add('slide-out-left');
    document.getElementById('allFlashcardsContainerContainer').classList.add('slide-out-left');

    setTimeout(function() {
        document.getElementById('flashcardPageHeader').style.display = 'none';
        document.getElementById('flashcardPageHeader').classList.remove('slide-out-left');
        document.getElementById('quizOptionContainer').style.display = 'none';
        document.getElementById('quizOptionContainer').classList.remove('slide-out-left');
        document.getElementById('allFlashcardsContainerContainer').style.display = 'none';
        document.getElementById('allFlashcardsContainerContainer').classList.remove('slide-out-left');

        document.getElementById('entireQuizContainer').classList.add('slide-in-right');
        document.getElementById('entireQuizContainer').style.display = 'flex';
        document.getElementById('backToFlashcardsButton').classList.add('slide-in-right');
        document.getElementById('backToFlashcardsButton').style.display = 'flex';
    }, 300);

    setTimeout(function() {
        document.getElementById('entireQuizContainer').classList.remove('slide-in-right');
        document.getElementById('backToFlashcardsButton').classList.remove('slide-in-right');
    }, 600);
}

//Shuffle quiZArray
function shuffleArray() {
    for (let i = quizArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quizArray[i], quizArray[j]] = [quizArray[j], quizArray[i]];
    }
}

//Prepare the array for Quiz
let quizArray;
function prepareQuizArray(unlearned) {
    try {
        const data = fs.readFileSync('src/sets.json');
        const sets = JSON.parse(data);

        const set = sets.find(set => set.setId === currOpenedSetToView);
        
        if (set) {
            if (unlearned) {
                quizArray = set.cards
                    .filter(card => !card.learned) // Filter out learned cards
                    .map(card => card.cardId);
            } else {
                quizArray = set.cards.map(card => card.cardId);
            }
        } else {
            console.error(`Set with ID ${currOpenedSetToView} not found.`);
            return [];
        }
    } catch (err) {
        console.error(err);
        return [];
    }
    displayNextCardInArray();
}

function displayNextCardInArray() {
    shuffleArray();

    document.getElementById('cardFaceAnswer').style.display = 'none';
    document.getElementById('backToFlashCardListView').style.display = 'none';
    document.getElementById('rightWrongContainer').style.display = 'none';
    document.querySelector('.quizCardImg').style.display = 'none';
    document.querySelector('.quizCardImg').removeAttribute('src');

    
    if (quizArray.length === 0)
    {
        document.getElementById('cardFaceQuestion').innerHTML = "YOU'VE COMPLETED LEARNING THIS SET!<br>ʕ•́ᴥ•̀ʔっ";
        document.getElementById('backToFlashCardListView').style.display = 'block';
    }
    else
    {
        try {
            const data = fs.readFileSync('src/sets.json');
            const sets = JSON.parse(data);

            const set = sets.find(set => set.setId === currOpenedSetToView);
            
            // Check if there is a set with the given ID
            if (set) {
                // Check if there are cards in the set
                if (quizArray.length > 0) {
                    const cardId = quizArray[0];
                    const card = set.cards.find(card => card.cardId === cardId);
                    if (card) {
                        if (card.imgPath && card.imgPath != '')
                        {
                            document.querySelector('.quizCardImg').src = card.imgPath;
                        }
                        // Display the card question
                        document.getElementById('cardFaceQuestion').innerHTML = card.question;
                        // Display the card answer (assuming 'cardFaceAnswer' is the ID of the element)
                        document.getElementById('cardFaceAnswer').innerHTML = card.answer;
                    } else {
                        console.error(`Card with ID ${cardId} not found in set ${currOpenedSetToView}.`);
                    }
                } else {
                    console.error('Quiz array is empty.');
                }
            } else {
                console.error(`Set with ID ${currOpenedSetToView} not found.`);
            }
        } catch (err) {
            console.error(err);
        }
        setTimeout(() => {
            questionTime = true;
        }, 500);
    }
    
}

let questionTime;
function showAnswer()
{
    if (questionTime)
    {
        questionTime = false;
        document.getElementById('cardFaceAnswer').style.display = 'block';
        document.getElementById('cardFaceAnswer').classList.add('fade-in');
        document.getElementById('rightWrongContainer').style.display = 'flex';
        document.getElementById('rightWrongContainer').classList.add('fade-in');
        document.querySelector('.quizCardImg').style.display = 'block';
        document.querySelector('.quizCardImg').classList.add('fade-in');
    }
    setTimeout(() => {
        document.getElementById('cardFaceAnswer').classList.remove('fade-in');
        document.getElementById('rightWrongContainer').classList.remove('fade-in');
        document.querySelector('.quizCardImg').classList.remove('fade-in');
    }, 300);
}

function recalculateQuizArray(right)
{
    if (right)
    {
        quizArray.shift();
    }
    else
    {
        quizArray.push(quizArray[0]);
        quizArray.push(quizArray[0]);
        quizArray.shift();
    }   
    displayNextCardInArray();
}


function backToFlashcards()
{
    document.getElementById('entireQuizContainer').classList.add('slide-out-right');
    document.getElementById('backToFlashcardsButton').classList.add('slide-out-right');

    setTimeout(function() {
        document.getElementById('entireQuizContainer').style.display = 'none';
        document.getElementById('entireQuizContainer').classList.remove('slide-out-right');
        document.getElementById('backToFlashcardsButton').style.display = 'none';
        document.getElementById('backToFlashcardsButton').classList.remove('slide-out-right');

        document.getElementById('flashcardPageHeader').classList.add('slide-in-left');
        document.getElementById('flashcardPageHeader').style.display = 'block';
        document.getElementById('quizOptionContainer').classList.add('slide-in-left');
        document.getElementById('quizOptionContainer').style.display = 'flex';
        document.getElementById('allFlashcardsContainerContainer').classList.add('slide-in-left');
        document.getElementById('allFlashcardsContainerContainer').style.display = 'flex';
    }, 300);
    setTimeout(function() {
        document.getElementById('flashcardPageHeader').classList.remove('slide-in-left');
        document.getElementById('quizOptionContainer').classList.remove('slide-in-left');
        document.getElementById('allFlashcardsContainerContainer').classList.remove('slide-in-left');
    }, 600);
}