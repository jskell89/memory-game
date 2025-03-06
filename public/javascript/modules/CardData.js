// client/modules/CardData.js
export const cardData = [
    {
        name: 'bird',
        img: 'images/bird.png',
        isMatched: false
    },
    {
        name: 'bird',
        img: 'images/bird.png',
        isMatched: false
    },
    {
        name: 'coffee',
        img: 'images/coffee.png',
        isMatched: false
    },
    {
        name: 'coffee',
        img: 'images/coffee.png',
        isMatched: false
    },
    {
        name: 'hat',
        img: 'images/hat.png',
        isMatched: false
    },
    {
        name: 'hat',
        img: 'images/hat.png',
        isMatched: false
    },
    {
        name: 'owl',
        img: 'images/owl.png',
        isMatched: false
    },
    {
        name: 'owl',
        img: 'images/owl.png',
        isMatched: false
    },
    {
        name: 'sun',
        img: 'images/sun.png',
        isMatched: false
    },
    {
        name: 'sun',
        img: 'images/sun.png',
        isMatched: false
    },
    {
        name: 'hazard',
        img: 'images/hazard.png',
        isMatched: false
    },
    {
        name: 'hazard',
        img: 'images/hazard.png',
        isMatched: false
    }
];

export const resetCards = (cards) => {
    return cards.map(card => ({...card, isMatched: false}));
};

export const shuffleCards = (cards) => {
    return [...cards].sort(() => 0.5 - Math.random());
};
