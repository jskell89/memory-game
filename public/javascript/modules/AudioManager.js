// client/modules/AudioManager.js
export class AudioManager {
    constructor() {
        this.flip = new Audio('sounds/Card-flip.mp3');
        this.match = new Audio('sounds/anime-wow-sound-effect.mp3');
        this.buzzer = new Audio('sounds/Wheel-of-Fortune-Buzzer.mp3');
        this.cheering = new Audio('sounds/Crowd-Cheering-Sound-Effect.mp3');
        this.booing = new Audio('sounds/boo.wav');
        this.youSuck = new Audio('sounds/you-suck.mp3');
        this.winner = new Audio('sounds/winner.mp3');
    }
}
