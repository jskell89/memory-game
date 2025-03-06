import confetti  from 'canvas-confetti';
import { Player } from './modules/Player.js';
import { AudioManager } from './modules/AudioManager.js';
import { UIManager } from './modules/UIManager.js';
import { CardManager } from './modules/CardManager.js';

class Game {
    constructor() {
        this.player = new Player();
        this.audio = new AudioManager();
        this.ui = new UIManager();
        this.cardManager = new CardManager();
        this.rounds = 3;
        this.totalCards = this.cardManager.getCardCount();
        this.totalMatchesNeeded = this.totalCards * 0.5;
    }

    init() {
        this.cardManager.shuffle();
        this.createLives();
        this.bindEvents();
    }

    bindEvents() {
        this.ui.elements.form.addEventListener('submit', (e) => this.handleFormSubmission(e));
        this.ui.elements.startOverBtn.addEventListener('click', () => this.resetBoard());
        this.ui.elements.quiteBtn.addEventListener('click', () => this.closeGame());
        this.ui.elements.promptYesBtn.addEventListener('click', () => {
            this.ui.elements.prompt.close();
            this.ui.elements.overlay.style.display = 'none';
            this.resetGame()
        });
        this.ui.elements.promptNoBtn.addEventListener('click', () => {
            this.ui.elements.prompt.close();
            this.ui.elements.overlay.style.display = 'none';
            this.closeGame()
        });
    }

    handleFormSubmission(e) {
        e.preventDefault();
        this.resetGame();
        this.player.name = document.getElementById('username').value;
        this.ui.elements.footer.textContent = `Welcome ${this.player.name}!`;
        this.ui.elements.formWrapper.style.display = 'none';
        this.ui.elements.game.style.display = 'grid';
    }

    createLives() {
        for (let i = 0; i < this.player.lives; i++) {
            const life = document.createElement('img');
            life.className = 'life';
            life.src = 'images/brain-giphy.gif';
            this.ui.elements.livesContainer.appendChild(life);
        }
    }

    createBoard() {
        for(let i = 0; i < this.totalCards; i++) {
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
            cardBackImg.src = this.cardManager.getCard(i).img;
            cardBackImg.className = 'card-back-img';

            cardFront.appendChild(cardFrontImg);
            cardBack.appendChild(cardBackImg);
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);
            this.ui.elements.cardContainer.appendChild(card);

            cardInner.addEventListener('click', this.flipCard.bind(this, i));
        }
    }


    flipCard(cardID) {
        const card = document.getElementById(cardID);
        card.classList.add('flipped');
        this.audio.flip.play();

        this.player.chosenCards.push(this.cardManager.getCard(cardID).img);

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
                    this.cardManager.getCard(card.getAttribute('id')).isMatched = true;
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
        let remainingMatches  = this.totalMatchesNeeded - this.player.matches;

        // checking if the player got all the matches if so check if done in less turns than required to win, if so records score and displays message.
        if (this.player.matches === this.totalMatchesNeeded) {
            if (this.player.getTotalScore() <= this.totalCards) {
                this.audio.cheering.play();
                this.recordHighScore(this.player.getTotalScore()); // updates players highScores array and displays in table on front end.

                if (this.player.getHighScores().length === 3) {
                    this.gameWin();
                } else {
                    this.roundWin(); // displays win message resets board for next round.
                }
            }
        }
        // checking to see if it's possible to get all matches in less turns than number of cards in cardArray, if not calls endLife().
        if (this.player.getTotalScore() + remainingMatches > this.totalCards) {
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
        this.player.addHighScore(score);
        this.ui.elements.scoreTable.insertAdjacentHTML('beforeend',
            `<tr class="row">
                <td>${score}</td>
            </tr>`
        );
    }

    updateScoreBoard() {
        this.ui.elements.matches.textContent = this.player.matches;
        this.ui.elements.misses.textContent = this.player.misses;
        this.ui.elements.total.textContent = this.player.getTotalScore().toString();
        this.ui.elements.turnsRemaining.textContent = (this.totalCards - this.player.getTotalScore()).toString();
        this.ui.elements.accuracy.textContent = this.player.getAccuracy();
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
        this.ui.elements.cardContainer.style.fontSize = "xx-large"
        this.ui.elements.cardContainer.style.color = 'green';
        this.ui.elements.cardContainer.textContent = 'Good Job!';
        setTimeout(this.resetBoard.bind(this), 3000);
    }

    roundLose() {
        this.ui.elements.cardContainer.style.fontSize = "xx-large";
        this.ui.elements.cardContainer.style.color = 'red';
        this.ui.elements.cardContainer.innerText = "You lost a life. \nTry Again!";
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
        this.ui.elements.cardContainer.style.color = "red";
        this.ui.elements.cardContainer.innerText = "Game Over!";
        this.audio.booing.pause();
        this.audio.youSuck.play();

        setTimeout(this.openPrompt.bind(this), 3000);
    }

    openPrompt() {
        this.ui.elements.overlay.style.display = 'block';
        this.ui.elements.prompt.open = true;
    }

    async statAnimation () {
        const stats = [
            { text: "High Score: " + this.player.getHighestScore().toString() },
            { text: "Average Score: " + this.player.getAverageScore().toString() },
            { text: "Accuracy: " + (((this.totalMatchesNeeded * this.rounds) / (this.player.getHighScores().reduce((accumulator, currentValue) => accumulator + currentValue, 0))) * 100).toFixed().toString() + "%" }
        ];

        const animationDelay = 1300;

        for (const stat of stats) {
            const p = document.createElement('p');
            p.textContent = stat.text;
            p.className = 'stat-item';
            this.ui.elements.stats.append(p);

            await new Promise(resolve => setTimeout(resolve, animationDelay));
        }

       this.ui.elements.btnGroup.classList.add('fade-in');
    }

    resetLives() {
        const lives = this.ui.elements.livesContainer.querySelectorAll('.life');
        lives.forEach((life) => {life.style.display = 'inline'});
        this.player.lives = 3;
    }

    resetScores() {
        this.player.clearHighScores();
        this.clearScoreTable();
    }

    resetGame() {
        this.resetLives();
        this.resetScores();
        this.resetBoard();
        this.ui.elements.stats.replaceChildren();
        this.ui.elements.btnGroup.classList.remove('fade-in');
    }

    clearScoreTable() {
        const rows = this.ui.elements.scoreTable.querySelectorAll('.row');
        rows.forEach(row => row.remove());
    }

    resetBoard() {
        prompt.open = false;
        if (this.player.getHighScores().length < 3 || this.player.lives > 0) {

            this.ui.elements.cardContainer.textContent = "";
            this.ui.elements.misses.textContent = "";
            this.ui.elements.matches.textContent = "";
            this.ui.elements.total.textContent = "";
            this.ui.elements.turnsRemaining.textContent = this.totalCards.toString();
            this.ui.elements.accuracy.textContent = "";

            this.player.reset();
            this.cardManager.shuffle();
            this.createBoard();
        }
    }

    // hides game shows login form. login form submit resets game.
    closeGame() {
        this.ui.elements.game.style.display = "none";
        this.ui.elements.formWrapper.style.display = "block";
        document.getElementById('username').value = "";
        this.player.name = "";
        this.ui.elements.cardContainer.replaceChildren();
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
