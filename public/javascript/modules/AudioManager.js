// client/modules/AudioManager.js
export class AudioManager {
    constructor() {
        this.sounds = {
            flip: new Audio('sounds/Card-flip.mp3'),
            match: new Audio('sounds/anime-wow-sound-effect.mp3'),
            buzzer: new Audio('sounds/Wheel-of-Fortune-Buzzer.mp3'),
            cheering: new Audio('sounds/Crowd-Cheering-Sound-Effect.mp3'),
            booing: new Audio('sounds/boo.wav'),
            youSuck: new Audio('sounds/you-suck.mp3'),
            noCigar: new Audio('sounds/no-cigar.mp3'),
            winner: new Audio('sounds/winner.mp3')
        }
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].play();
        }
        console.error(`Sound ${soundName} not found`);
    }

    stop(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].pause();
        }
    }
}