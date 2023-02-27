//card options
const cardArray = [
    {
        name: 'bird',
        img: 'images/bird.png'
    },
    {
        name: 'bird',
        img: 'images/bird.png'
    },
    {
        name: 'coffee',
        img: 'images/coffee.png'
    },
    {
        name: 'coffee',
        img: 'images/coffee.png'
    },
    {
        name: 'hat',
        img: 'images/hat.png'
    },
    {
        name: 'hat',
        img: 'images/hat.png'
    },
    {
        name: 'owl',
        img: 'images/owl.png'
    },
    {
        name: 'owl',
        img: 'images/owl.png'
    },
    {
        name: 'sun',
        img: 'images/sun.png'
    },
    {
        name: 'sun',
        img: 'images/sun.png'
    },
    {
        name: 'hazard',
        img: 'images/hazard.png'
    },
    {
        name: 'hazard',
        img: 'images/hazard.png'
    },
];

cardArray.sort(() => 0.5 - Math.random());

const flipCardAudio = new Audio('sounds/Card-flip.mp3');
const foundMatchAudio = new Audio('sounds/anime-wow-sound-effect.mp3');
const buzzer = new Audio('sounds/Wheel-of-Fortune-Buzzer.mp3');
const cheering = new Audio('sounds/Crowd-Cheering-Sound-Effect.mp3');
const booing = new Audio('sounds/boo.wav');
const youSuck = new Audio('sounds/you-suck.mp3');
const noCigar = new Audio('sounds/no-cigar.mp3');
const winner = new Audio('sounds/winner.mp3');

const grid = document.querySelector('.grid');
const dialogBox = document.getElementById('dialog');
const matches = document.getElementById('matches');
const misses = document.getElementById('misses');
const total = document.getElementById('total');
const scoreTable = document.querySelector('.bestScores');
const life1 = document.getElementById('life1');
const life2 = document.getElementById('life2');
const life3 = document.getElementById('life3');
const form = document.getElementById('form');
const game = document.querySelector('.wrapper');
const footer = document.getElementById('footer');
const prompt = document.getElementById('prompt');

var Username = [];
var cardsChosen = [];
var cardsChosenId = [];
var cardsWon = [];
var cardsLost = [];
var bestScores = [];
var deaths = [];

//handles form submission and stores value of username in variable to display in footer and in array to display in winning message. Turns off display for form element and turns it on for div wrapping the game elements. 
form.addEventListener('submit', (e) => {
    e.preventDefault();
    resetBoard();
    var username = document.getElementById('username').value;
    game.style.display = "grid";
    form.style.display = "none";
    footer.textContent = "Welcome " + username + "!";
    Username.push(username);
})

//create game board by looping through cardArray setting src images, unique id, and a class name then appending to the grid div. Puts event listener on each card and invokes flipCard function on click. 
function createBoard() {
    if (deaths.length === 3 || bestScores.length === 3) {
        endRound();
    } else {
        for (let i = 0; i < cardArray.length; i++) {
            var card = document.createElement('img');
            card.setAttribute('src', 'images/blank.png');
            card.setAttribute('id', i);
            card.setAttribute('class', 'card');
            card.addEventListener('click', flipCard);
            grid.appendChild(card);
        }
    }
}

//check for matches and determine win or loss. Stores wins and losses and checks score to determine unique alerts, messaging, if score should be recorded, and calls resetBoard.
function checkForMatch() {
    var cards = document.querySelectorAll('.card');
    const optionOneId = cardsChosenId[0];
    const optionTwoId = cardsChosenId[1];
    if (cardsChosen[0] === cardsChosen[1]) {
        foundMatchAudio.play();
        cards[optionOneId].setAttribute('src', 'images/white.png');
        cards[optionTwoId].setAttribute('src', 'images/white.png');
        cardsWon.push(cardsChosen);
    } else {
        cards[optionOneId].setAttribute('src', 'images/blank.png');
        cards[optionOneId].addEventListener('click', flipCard);
        cards[optionTwoId].setAttribute('src', 'images/blank.png');
        cards[optionTwoId].addEventListener('click', flipCard);
        
        cardsLost.push(cardsChosen);
        buzzer.play();
    }
    var curScore = cardsWon.length + cardsLost.length;
    var remainder = 6 - cardsWon.length;

    if (cardsWon.length === cardArray.length / 2) {
        checkScore()
        setTimeout(resetBoard, 3000);
    }
    // remainder is added to current score so user doesn't have to play out until they are above threshold when there is no chance of winning.
    if (curScore + remainder > 12) {
        foundMatchAudio.pause();
        booing.play();
        deaths.push(curScore);
        endLife()
        setTimeout(resetBoard, 3000);
        if(deaths.length < 3){
        grid.style.fontSize = "xx-large";
        grid.style.color = 'red';
        grid.innerText = "You lost a life. \nTry Again!";
        }
    }
    cardsChosen = [];
    cardsChosenId = [];
    matches.textContent = cardsWon.length;
    misses.textContent = cardsLost.length;
    total.textContent = cardsWon.length + cardsLost.length

}
//checks if final score is one over threshold, plays unique sound, and ends life. Checks for scores under threshold and gives corresponding message and records score. 
function checkScore() {
    var finalScore = cardsWon.length + cardsLost.length;
    if (finalScore === 13) {
        foundMatchAudio.pause();
        booing.pause();
        noCigar.play();
        endLife();
    }
    if (finalScore <= 12) {
        cheering.play();
        recordScore();
        grid.style.fontSize = "xx-large"
        grid.style.color = 'green';
        grid.textContent = 'Good Job!';
    }
}

//flip your card and store in cardsChosen array so they can be compared in checkForMatch function. Also storing the Id so the correct cards can be targeted for attribute change.
//Removes click event listener so that cards currently chosen cannot be clicked twice. put back on in checkForMatch once card is flipped back over.
function flipCard() {
    this.removeEventListener('click', flipCard)
    flipCardAudio.play();
    var cardId = this.getAttribute('id');
    cardsChosen.push(cardArray[cardId].name);
    cardsChosenId.push(cardId);
    this.setAttribute('src', cardArray[cardId].img);
    if (cardsChosen.length == 2) {
        setTimeout(checkForMatch, 500);
    }
}
//starts next round by clearing out misses and matches. Clears arrays, cardsWon, lost, and chosen. reshuffles cardsArray and creates new board. 
//Is used to generate a new board until conditions are met to complete the entire round. In which case endRound is triggered in createBoard which will also clear out deaths and high scores. 
function resetBoard() {
    prompt.open = false;
    if (bestScores.length < 3 || deaths.length < 3) {
        grid.textContent = " ";
        misses.textContent = " ";
        matches.textContent = " ";
        total.textContent = " ";
        cardsChosen = [];
        cardsChosenId = [];
        cardsWon = [];
        cardsLost = [];
        cardArray.sort(() => 0.5 - Math.random());
        createBoard();
    }
}

//Creates Score table rows and writes score to table data elements. Pushes score to bestScores array. Executes until 3 bestScores have been recorded.
function recordScore() {
    var totalScore = cardsWon.length + cardsLost.length;
    if (bestScores.length <= 3) {
        bestScores.push(totalScore);
        var tableRow = document.createElement('tr');
        tableRow.setAttribute('class', 'row');
        var tableData = document.createElement('td');
        tableData.innerText = cardsWon.length + cardsLost.length;
        tableRow.appendChild(tableData);
        scoreTable.appendChild(tableRow);
    }
}
// removes table rows in scores table, clears bestScores and deaths arrays. Determines which message to display and re-displays any lost lives. 
// opens end of game prompt asking if you want to play again. Yes invokes resetBoard so you can continue as current user. No takes you back to the sign in form. 
function endRound() {
    prompt.open = true;
    if (bestScores.length === 3) {
        bestScores.sort(function (a, b) { return a - b });
        var bestScore = bestScores[0];
        var avgScore = bestScores.reduce((a, b) => a + b, 0) / bestScores.length;
        grid.style.fontSize = 'large';
        grid.style.color = "green";
        grid.innerText = "Congratulations " + Username[0] + "!!" + "\nYour best score was: " + bestScore + "\nYour average was: " + avgScore.toFixed(2);
        winner.play();
    }
    if (deaths.length === 3) {
        grid.style.color = "red";
        grid.innerText = "Game Over!";
        booing.pause();
        youSuck.play();
    }
    for (let i = 0; i < bestScores.length; i++) {
        scoreTable.removeChild(document.querySelector('.row'));
    }
    life1.style.display = "inline";
    life2.style.display = "inline";
    life3.style.display = "inline";
    deaths = [];
    bestScores = [];
}
//checks number of deaths and turns off display on img elements representing lives.
function endLife() {
    if (deaths.length === 1) {
        life3.style.display = "none";
    }
    if (deaths.length === 2) {
        life2.style.display = "none";
    }
    if (deaths.length === 3) {
        life1.style.display = "none";
    }
}
//turns display off for wrapper div around game elements, assigns display value to form, and clears current users username from Username array. 
function closeGame() {
    game.style.display = "none";
    form.style.display = "block";
    Username = [];
}





