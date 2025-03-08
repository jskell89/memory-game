// client/modules/UIManager.js
import confetti from "canvas-confetti";

export class UIManager {
    constructor(player, cardManager, callbacks, rounds, totalMatchesNeeded) {
        this.player = player;
        this.cardManager = cardManager;
        this.callbacks = callbacks;
        this.rounds = rounds;
        this.totalMatchesNeeded = totalMatchesNeeded;
        this.totalCards = this.cardManager.getCardCount();
        this.elements = {
            overlay: document.querySelector('.overlay'),
            cardContainer: document.querySelector('.card-container'),
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
            //dialog box
            prompt: document.getElementById('prompt'),
            stats: document.querySelector('.stats'),
            btnGroup: document.querySelector('.button-txt-group'),
            promptYesBtn: document.getElementById('yesBtn'),
            promptNoBtn: document.getElementById('noBtn')
        }
    }

    bindEvents() {
        this.elements.form.addEventListener('submit', (e) => this.callbacks.onFormSubmit(e));
        this.elements.startOverBtn.addEventListener('click', () => this.resetBoard());
        this.elements.quiteBtn.addEventListener('click', () => this.closeGame());
        this.elements.promptYesBtn.addEventListener('click', () => {
            this.elements.prompt.close();
            this.elements.overlay.style.display = 'none';
            this.callbacks.resetGame();
        });
        this.elements.promptNoBtn.addEventListener('click', () => {
            this.elements.prompt.close();
            this.elements.overlay.style.display = 'none';
            this.closeGame()
        });
    }

    createLives() {
        for (let i = 0; i < this.player.lives; i++) {
            const life = document.createElement('img');
            life.className = 'life';
            life.src = 'images/brain-giphy.gif';
            this.elements.livesContainer.appendChild(life);
        }
    }

    removeLife() {
        let lives = this.elements.livesContainer.querySelectorAll('.life');
        lives[this.player.lives].style.display = 'none';
    }

    addLives() {
        const lives = this.elements.livesContainer.querySelectorAll('.life');
        lives.forEach(life => { life.style.display = 'inline'});
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
            this.elements.cardContainer.appendChild(card);

            cardInner.addEventListener('click', () => this.callbacks.onCardFlip(i));
        }
    }

    recordHighScore(score) {
        this.player.addHighScore(score);
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
        this.elements.turnsRemaining.textContent = (this.totalCards - this.player.getTotalScore()).toString();
        this.elements.accuracy.textContent = this.player.getAccuracy();
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

    resetBoard() {
        prompt.open = false;
        if (this.player.getHighScores().length < 3 || this.player.lives > 0) {

            this.elements.cardContainer.textContent = "";
            this.elements.misses.textContent = "";
            this.elements.matches.textContent = "";
            this.elements.total.textContent = "";
            this.elements.turnsRemaining.textContent = this.totalCards.toString();
            this.elements.accuracy.textContent = "";

            this.player.reset();
            this.cardManager.shuffle();
            this.createBoard();
        }
    }

    showGameWin() {
        this.statAnimation();
        this.openPrompt();
    }

    showGameOver() {
        this.elements.cardContainer.style.color = "red";
        this.elements.cardContainer.innerText = "Game Over!";
        this.elements.btnGroup.style.opacity = "1";
        setTimeout(this.openPrompt.bind(this), 3000);
    }

    openPrompt() {
        this.elements.overlay.style.display = 'block';
        this.elements.prompt.open = true;
    }

    clearPrompt() {
        this.elements.stats.replaceChildren();
        this.elements.btnGroup.classList.remove('fade-in');
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
            this.elements.stats.append(p);

            await new Promise(resolve => setTimeout(resolve, animationDelay));
        }

        this.elements.btnGroup.classList.add('fade-in');
    }

    clearScoreTable() {
        const rows = this.elements.scoreTable.querySelectorAll('.row');
        rows.forEach(row => row.remove());
    }

    openGame() {
        this.player.name = document.getElementById('username').value;
        this.elements.footer.textContent = `Welcome ${this.player.name}!`;
        this.elements.formWrapper.style.display = 'none';
        this.elements.game.style.display = 'grid';
    }
    closeGame() {
        this.elements.game.style.display = "none";
        this.elements.formWrapper.style.display = "block";
        document.getElementById('username').value = "";
        this.player.name = "";
        this.elements.cardContainer.replaceChildren();
    }
}
