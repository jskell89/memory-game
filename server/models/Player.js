// server/models/Player.js
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lives: {
        type: Number,
        default: 3
    },
    currentGame: {
        matches: {
            type: Number,
            default: 0
        },
        misses: {
            type: Number,
            default: 0
        },
        chosenCards: [{
            type: String
        }]
    },
    highScores: [{
        type: Number
    }],
    gamesPlayed: {
        type: Number,
        default: 0
    },
    bestScore: {
        type: Number,
        default: null
    },
    timestamps: true
});

// Add methods that correspond to your frontend player methods
playerSchema.methods.getTotalScore = function() {
    return this.currentGame.matches + this.currentGame.misses;
};

playerSchema.methods.getAccuracy = function() {
    const total = this.getTotalScore();
    if (total === 0) return "0%";
    return ((this.currentGame.matches / total) * 100).toFixed() + "%";
};

playerSchema.methods.getAverageScore = function() {
    if (this.highScores.length === 0) return "0.00";
    const sum = this.highScores.reduce((acc, curr) => acc + curr, 0);
    return (sum / this.highScores.length).toFixed(2);
};

module.exports = mongoose.model('Player', playerSchema);
