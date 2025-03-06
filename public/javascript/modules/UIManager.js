// client/modules/UIManager.js
export class UIManager {
    constructor() {
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

    // UI manipulation methods
}