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
]

cardArray.sort(() => 0.5 - Math.random())

const flipCardAudio = new Audio('sounds/Card-flip.mp3')
const foundMatchAudio = new Audio('sounds/anime-wow-sound-effect.mp3')
const buzzer = new Audio('sounds/Wheel-of-Fortune-Buzzer.mp3')
const cheering = new Audio('sounds/Crowd-Cheering-Sound-Effect.mp3')
const booing = new Audio('sounds/boo.wav')
const grid = document.querySelector('.grid')
const resultDisplay = document.querySelector('#result')
const resultDisplayTwo = document.querySelector('#result2')
const scoreTable = document.querySelector('#table2')
var cardsChosen = []
var cardsChosenId = []
var cardsWon = []
var cardsLost = []
var scores = []


//create game board
function createBoard() {
    for (let i = 0; i < cardArray.length; i++) {
        var card = document.createElement('img')
        card.setAttribute('src', 'images/blank.png')
        card.setAttribute('id', i)
        card.setAttribute('class', 'back')
        card.addEventListener('click', flipCard)

        grid.appendChild(card)

    }
}

//check for matches and determine win or loss
function checkForMatch() {
    var cards = document.querySelectorAll('img')
    const optionOneId = cardsChosenId[0]
    const optionTwoId = cardsChosenId[1]
    if (cardsChosen[0] === cardsChosen[1]) {
        foundMatchAudio.play()
        cards[optionOneId].setAttribute('src', 'images/white.png')
        cards[optionTwoId].setAttribute('src', 'images/white.png')
        cards[optionOneId].setAttribute('class', 'blank')
        cards[optionTwoId].setAttribute('class', 'blank')
        cardsWon.push(cardsChosen)
    } else {
        cards[optionOneId].setAttribute('src', 'images/blank.png')
        cards[optionTwoId].setAttribute('src', 'images/blank.png')
        cards[optionOneId].setAttribute('class', 'back')
        cards[optionTwoId].setAttribute('class', 'back')
        cardsLost.push(cardsChosen)
        buzzer.play()
    }
    cardsChosen = []
    cardsChosenId = []
    resultDisplay.textContent = cardsWon.length
    resultDisplayTwo.textContent = cardsLost.length
    if (cardsWon.length === cardArray.length / 2) {
        grid.style.color = 'green'
        grid.textContent = 'Winner!'
        cheering.play()
        setTimeout(resetBoard, 3000)
        scores.push(cardsWon.length + cardsLost.length)
        recordScore()
    }
    if (cardsLost.length === 20) {
        grid.style.color = 'red'
        grid.textContent = 'Game Over!'
        booing.play()
        setTimeout(resetBoard, 3000)
    }
}

//flip your card
function flipCard() {
    this.setAttribute('class', 'front')
    flipCardAudio.play()
    var cardId = this.getAttribute('id')
    cardsChosen.push(cardArray[cardId].name)
    cardsChosenId.push(cardId)
    this.setAttribute('src', cardArray[cardId].img)
    if (cardsChosen.length == 2) {
        setTimeout(checkForMatch, 500)
    }
}
//starts game over
function resetBoard() {

    // for (let i = 0; i < 12; i++) {
    //     grid.removeChild(document.getElementById(i))
    // }
    cardArray.sort(() => 0.5 - Math.random())
    grid.textContent = " "
    createBoard()
    resultDisplay.textContent = " "
    resultDisplayTwo.textContent = " "
    cardsChosen = []
    cardsChosenId = []
    cardsWon = []
    cardsLost = []
}
//Creates Score table rows and writes score to table data elements. Executes until final round 5 Then wipes scores clean. 
function recordScore() {
    if (scores.length < 2) {
        var tableRow = document.createElement('tr')
        tableRow.setAttribute('class', 'row')
        var tableData = document.createElement('td')
        tableData.setAttribute('class', 'score')
        tableData.innerText = cardsWon.length + cardsLost.length
        tableRow.appendChild(tableData)
        scoreTable.appendChild(tableRow)
    } else {
        scores.sort(function (a, b) { return a - b });
        var bestScore = scores[0]
        grid.textContent = "Your best score was: " + bestScore
        setTimeout(endRound, 3000)
    }
}

function endRound() {
    var tr = document.querySelector('.row')
    var td = document.querySelector('.score')
    tr.removeChild(td)
    scores = []
    resetBoard()
}



createBoard()
