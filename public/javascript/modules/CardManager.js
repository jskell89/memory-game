// client/modules/CardManager.js
import {cardData, resetCards, shuffleCards} from "./CardData";

export class CardManager {
    constructor() {
        this.cards = [...cardData];
    }

    // Get single card
    getCard(index) {
        return this.cards[index];
    }

    // Get total number of cards
    getCardCount() {
        return this.cards.length;
    }

    shuffle() {
        this.cards = shuffleCards(this.cards);
    }

    reset() {
        this.cards = resetCards(this.cards);
        this.shuffle();
    }
}