// client/modules/Player.js
export class Player {
    constructor() {
        this.name = '';
        this.lives = 3;
        this.matches = 0;
        this.misses = 0;
        this._highScores = [];  // Using underscore to indicate it's "private"
        this.chosenCards = [];
    }

    // Getter for highScores
    getHighScores() {
        return [...this._highScores]; // Return a copy to prevent direct modification
    }

    getHighestScore() {
        return Math.min(...this._highScores);
    }

    addHighScore(score) {
        this._highScores.push(score);
    }

    clearHighScores() {
        this._highScores = [];
    }

    getTotalScore() {
        return this.matches + this.misses;
    }

    getAverageScore() {
        const sum = this._highScores.reduce((acc, current) => acc + current, 0);
        return (sum / this._highScores.length).toFixed(2);
    }

    getAccuracy() {
        let accuracy = (this.matches / this.getTotalScore()) * 100;
        return accuracy.toFixed().toString() + "%";
    }

    reset() {
        this.matches = 0;
        this.misses = 0;
        this.chosenCards = [];
    }
}
