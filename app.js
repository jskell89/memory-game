class Game {
    constructor() {
        this.cardArray = [
            {
                name: 'bird',
                img: 'images/bird.png',
                isMatched: false
            },
            {
                name: 'bird',
                img: 'images/bird.png',
                isMatched: false
            },
            {
                name: 'coffee',
                img: 'images/coffee.png',
                isMatched: false
            },
            {
                name: 'coffee',
                img: 'images/coffee.png',
                isMatched: false
            },
            {
                name: 'hat',
                img: 'images/hat.png',
                isMatched: false
            },
            {
                name: 'hat',
                img: 'images/hat.png',
                isMatched: false
            },
            {
                name: 'owl',
                img: 'images/owl.png',
                isMatched: false
            },
            {
                name: 'owl',
                img: 'images/owl.png',
                isMatched: false
            },
            {
                name: 'sun',
                img: 'images/sun.png',
                isMatched: false
            },
            {
                name: 'sun',
                img: 'images/sun.png',
                isMatched: false
            },
            {
                name: 'hazard',
                img: 'images/hazard.png',
                isMatched: false
            },
            {
                name: 'hazard',
                img: 'images/hazard.png',
                isMatched: false
            }
        ]

        this.audio = {
            flip: new Audio('sounds/Card-flip.mp3'),
            match: new Audio('sounds/anime-wow-sound-effect.mp3'),
            buzzer: new Audio('sounds/Wheel-of-Fortune-Buzzer.mp3'),
            cheering: new Audio('sounds/Crowd-Cheering-Sound-Effect.mp3'),
            booing: new Audio('sounds/boo.wav'),
            youSuck: new Audio('sounds/you-suck.mp3'),
            noCigar: new Audio('sounds/no-cigar.mp3'),
            winner: new Audio('sounds/winner.mp3')
        }  

        this.elements = {
            overlay: document.querySelector('.overlay'),
            cardContainer: document.querySelector('.card-container'),
            dialogBox: document.getElementById('dialog'),
            matches: document.getElementById('matches'),
            misses: document.getElementById('misses'),
            total: document.getElementById('total'),
            turnsRemaining: document.getElementById('turnsRemaining'),
            accuracy: document.getElementById('accuracy'),
            scoreTable: document.querySelector('.highScores'),
            formWrapper: document.querySelector('.form-wrapper'),
            form: document.getElementById('startGameForm'),
            game: document.querySelector('.game-wrapper'),
            footer: document.getElementById('footer'),
            livesContainer: document.getElementById('lives'),
            startOverBtn: document.getElementById('startOver'),
            quiteBtn: document.getElementById('quit'),
            prompt: document.getElementById('prompt'),
            promptYesBtn: document.getElementById('yesBtn'),
            promptNoBtn: document.getElementById('noBtn')
        }

    this.player = {
            name: '',
            lives: 3,
            matches: 0,
            misses: 0,
            highScores: [],
            chosenCards: [], //temporarily stores the cards chosen by the user to check for match (only two cards are ever added may want to consider two variables instead of array)

            getTotalScore: function () {
                return this.matches + this.misses;
            },

            getBestScore: function () {
                return Math.min(...this.highScores);
            },

            getAverageScore: function () {
              const sum = this.highScores.reduce((acc, current) => acc + current, 0);
              return (sum / this.highScores.length).toFixed(2);
            },

            getAccuracy: function () {
                let accuracy = (this.matches / this.getTotalScore()) * 100;
              return accuracy.toFixed().toString() + "%";
            },

            reset() {
                this.matches = 0;
                this.misses = 0;
                this.chosenCards = [];
            }
        }
        
    }

    init() {
        this.shuffleCards();
        this.createLives();
        this.bindEvents();
    }

    shuffleCards() {
        this.cardArray.sort(() => 0.5 - Math.random());
    }

    bindEvents() {
        this.elements.form.addEventListener('submit', (e) => this.handleFormSubmission(e));
        this.elements.startOverBtn.addEventListener('click', () => this.resetBoard());
        this.elements.quiteBtn.addEventListener('click', () => this.closeGame());
        this.elements.promptYesBtn.addEventListener('click', () => {
            this.elements.prompt.close();
            this.elements.overlay.style.display = 'none';
            this.resetGame()
        });
        this.elements.promptNoBtn.addEventListener('click', () => {
            this.elements.prompt.close();
            this.elements.overlay.style.display = 'none';
            this.closeGame()
        });
    }

    handleFormSubmission(e) {
        e.preventDefault();
        this.resetGame();
        this.player.name = document.getElementById('username').value;
        this.elements.footer.textContent = `Welcome ${this.player.name}!`;
        this.elements.formWrapper.style.display = 'none';
        this.elements.game.style.display = 'grid';
    }

    createLives() {
        for (let i = 0; i < this.player.lives; i++) {
            const life = document.createElement('img');
            life.className = 'life';
            life.src = 'images/brain-giphy.gif';
            this.elements.livesContainer.appendChild(life);
        }
    }

    createBoard() {
        for(let i = 0; i < this.cardArray.length; i++) {
            const card = document.createElement('div');
            const cardInner = document.createElement('div');
            const cardFront = document.createElement('div');
            const cardFrontImg = document.createElement('img');
            const cardBack = document.createElement('div');
            const cardBackImg = document.createElement('img');

            card.className = 'card';
            cardInner.className = 'card-inner';
            cardInner.setAttribute('id', i.toString());
            cardFront.className = 'card-front';
            cardBack.className = 'card-back';
            cardFrontImg.src = 'images/blank.png';
            cardBackImg.src = this.cardArray[i].img;
            cardBackImg.className = 'card-back-img';
            
            cardFront.appendChild(cardFrontImg);
            cardBack.appendChild(cardBackImg);
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);
            this.elements.cardContainer.appendChild(card);

            cardInner.addEventListener('click', this.flipCard.bind(this, i));
        }
    }


    flipCard(cardID) { 
        const card = document.getElementById(cardID);
        card.classList.add('flipped');
        this.audio.flip.play();

        this.player.chosenCards.push(this.cardArray[cardID].img);

        if (this.player.chosenCards.length === 2) {
            setTimeout(this.checkForMatch.bind(this), 500);
        }
    }

     checkForMatch() {
        let cards = document.querySelectorAll('.card-inner');

        if (this.player.chosenCards[0] === this.player.chosenCards[1]) {
            this.audio.match.play();
            this.player.matches += 1;

            cards.forEach(card => {
                if (card.classList.contains('flipped')) {
                    card.classList.add('matched');
                    this.cardArray[card.getAttribute('id')].isMatched = true;
                } 
            });

        } else {
            this.audio.buzzer.play();
            this.player.misses += 1;

            cards.forEach(card => {
                if (!card.classList.contains('matched')) {
                    setTimeout(() => {
                        card.classList.remove('flipped');
                    }, 500);
                }
                
            });
        }
        this.checkWinCondition();
    }


    checkWinCondition() {
        let totalMatchesToWin = this.cardArray.length / 2;
        let remainingMatches  = totalMatchesToWin - this.player.matches;

        // checking if the player got all the matches if so check if done in less turns than required to win, if so records score and displays message.
        if (this.player.matches === totalMatchesToWin) {
            if (this.player.getTotalScore() <= this.cardArray.length) {
                this.audio.cheering.play();
                this.recordHighScore(this.player.getTotalScore()); // updates players highScores array and displays in table on front end.

                if (this.player.highScores.length === 3) {
                    this.gameWin();
                } else {
                    this.roundWin(); // displays win message resets board for next round.
                }
            }
        }
        // checking to see if it's possible to get all matches in less turns than number of cards in cardArray, if not calls endLife().
        if (this.player.getTotalScore() + remainingMatches > this.cardArray.length) {
            this.audio.match.pause();
            this.audio.booing.play();
            this.player.lives -= 1;
            this.endLife(); // removes life indicators and checks if 0 lives left if so calls gameOver().

            if (this.player.lives > 0) {
                this.roundLose(); // displays lose message resets board for next round
            }
        }

        // clear chosenCards array and update running scoreboard.
        this.player.chosenCards = [];
        this.updateScoreBoard();
    }

    recordHighScore(score) {
        this.player.highScores.push(score);
        this.elements.scoreTable.insertAdjacentHTML('beforeend',
            `<tr class="row">
                <td>${score}</td>
            </tr>`
        );
    }

    updateScoreBoard() {
        this.elements.matches.textContent = this.player.matches;
        this.elements.misses.textContent = this.player.misses;
        this.elements.total.textContent = this.player.getTotalScore().toString();
        this.elements.turnsRemaining.textContent = (this.cardArray.length - this.player.getTotalScore()).toString();
        this.elements.accuracy.textContent = this.player.getAccuracy();
    }

    // sets display to none on indicators for lives and calls gameOver if no lives left.
    endLife() {
        let lives = document.querySelectorAll('.life');
        lives[this.player.lives].style.display = 'none';
    
        if (this.player.lives === 0) {
            this.gameOver();
        }
    }

    roundWin() {
        this.elements.cardContainer.style.fontSize = "xx-large"
        this.elements.cardContainer.style.color = 'green';
        this.elements.cardContainer.textContent = 'Good Job!';
        setTimeout(this.resetBoard.bind(this), 3000);
    }

    roundLose() {
        this.elements.cardContainer.style.fontSize = "xx-large";
        this.elements.cardContainer.style.color = 'red';
        this.elements.cardContainer.innerText = "You lost a life. \nTry Again!";
        setTimeout(this.resetBoard.bind(this), 3000);
    }

    gameWin() {
        confetti({
            particleCount: 1000,
            spread: 1000,
            origin: { y: 0.3 }
        });
        this.statAnimation();
        this.audio.winner.play();
        this.openPrompt();
    }

    gameOver() {
        this.elements.cardContainer.style.color = "red";
        this.elements.cardContainer.innerText = "Game Over!";
        this.audio.booing.pause();
        this.audio.youSuck.play();

        setTimeout(this.openPrompt.bind(this), 3000);
    }

    openPrompt() {
        this.elements.overlay.style.display = 'block';
        this.elements.prompt.open = true;
    }

    async statAnimation () {
        const stats = [
            { text: "High Score: " + this.player.getBestScore() },
            { text: "Average Score: " + this.player.getAverageScore() },
            { text: "Accuracy: " + this.player.getAccuracy() }
        ];

        const animationDelay = 1300; // Adjust timing as needed

        for (const stat of stats) {
            const p = document.createElement('p');
            p.textContent = stat.text;
            p.className = 'stat-item';
            document.querySelector('.stats').append(p);

            await new Promise(resolve => setTimeout(resolve, animationDelay));
        }

        const buttonGroup = document.querySelector('.button-txt-group');
        buttonGroup.classList.add('fade-in');
    }

    resetLives() {
        const lives = this.elements.livesContainer.querySelectorAll('.life');
        lives.forEach((life) => {life.style.display = 'inline'});
        this.player.lives = 3;
    }

    resetScores() {
        this.player.highScores = [];
        this.clearScores();
    }

    resetGame() {
        this.resetLives();
        this.resetScores();
        this.resetBoard()
    }

    clearScores() {
        const rows = this.elements.scoreTable.querySelectorAll('.row');
        rows.forEach(row => row.remove());
    }

    resetBoard() {
        prompt.open = false;
        if (this.player.highScores.length < 3 || this.player.lives > 0) {

            this.elements.cardContainer.textContent = "";
            this.elements.misses.textContent = "";
            this.elements.matches.textContent = "";
            this.elements.total.textContent = "";
            this.elements.turnsRemaining.textContent = this.cardArray.length.toString();
            this.elements.accuracy.textContent = "";

            this.player.reset();
            this.shuffleCards();
            this.createBoard();
        }
    }

    // hides game shows login form. login form submit resets game.
    closeGame() {
        this.elements.game.style.display = "none";
        this.elements.formWrapper.style.display = "block";
        document.getElementById('username').value = "";
        this.player.name = "";
        this.elements.cardContainer.replaceChildren();
    }

    debugStats = () => {
        this.gameWin();
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    window.game = game; // only need for testing purposes to call debugStats() from console
    window.debugStats = game.debugStats;
    game.init();
});
