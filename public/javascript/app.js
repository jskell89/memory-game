import confetti  from 'canvas-confetti';
import { Player } from './modules/Player.js';
import { AudioManager } from './modules/AudioManager.js';
import { UIManager } from './modules/UIManager.js';
import { CardManager } from './modules/CardManager.js';

class Game {
    constructor() {
        this.player = new Player();
        this.audio = new AudioManager();
        this.cardManager = new CardManager();
        this.uiCallbacks = {
            onCardFlip: this.flipCard.bind(this),
            onFormSubmit: this.handleFormSubmission.bind(this),
            resetGame: this.resetGame.bind(this)
        }
        this.rounds = 3;
        this.totalCards = this.cardManager.getCardCount();
        this.totalMatchesNeeded = this.totalCards * 0.5;
        this.ui = new UIManager(this.player, this.cardManager, this.uiCallbacks, this.rounds, this.totalMatchesNeeded);
    }

    init() {
        this.cardManager.shuffle();
        this.ui.createLives();
        this.ui.bindEvents();
    }

    handleFormSubmission(e) {
        e.preventDefault();
        this.resetGame();
        this.ui.openGame();
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
                this.ui.recordHighScore(this.player.getTotalScore());

                if (this.player.getHighScores().length === 3) {
                    this.gameWin();
                } else {
                    this.ui.roundWin();
                }
            }
        }
        // checking to see if it's possible to get all matches in less turns than number of cards in cardArray, if not calls endLife().
        if (this.player.getTotalScore() + remainingMatches > this.totalCards) {
            this.audio.match.pause();
            this.audio.booing.play();
            this.player.lives -= 1;
            this.endLife();

            if (this.player.lives > 0) {
                this.ui.roundLose();
            }
        }

        this.player.chosenCards = [];
        this.ui.updateScoreBoard();
    }

    endLife() {
        this.ui.removeLife();
        if (this.player.lives === 0) {
            this.gameOver();
        }
    }

    gameWin() {
        confetti({
            particleCount: 1000,
            spread: 1000,
            origin: { y: 0.3 }
        });
        this.audio.winner.play();
        this.ui.showGameWin();
    }

    gameOver() {
        this.audio.booing.pause();
        this.audio.youSuck.play();
        this.ui.showGameOver();
    }

    resetLives() {
        this.player.lives = 3;
        this.ui.addLives();
    }

    resetScores() {
        this.player.clearHighScores();
        this.ui.clearScoreTable();
    }

    resetGame() {
        this.resetLives();
        this.resetScores();
        this.ui.resetBoard();
        this.ui.clearPrompt();
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
