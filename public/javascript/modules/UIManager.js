// client/modules/UIManager.js
export class UIManager {
    constructor() {
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
    }

    // UI manipulation methods
}