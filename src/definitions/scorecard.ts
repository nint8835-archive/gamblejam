import { countNumbers, NumberCounts, range } from '../util';

export type ScoreCardEntryId =
    | 'Aces'
    | 'Twos'
    | 'Threes'
    | 'Fours'
    | 'Fives'
    | 'Sixes'
    | 'ThreeOfAKind'
    | 'FourOfAKind'
    | 'FullHouse'
    | 'SmallStraight'
    | 'LargeStraight'
    | 'Yahtzee'
    | 'Chance';

export type ScoreCardEntry = {
    id: ScoreCardEntryId;
    name: string;
    description: string;
    shopCost: number;
    scoreFunc: (dice: number[]) => number;
};

export const ScoreCardEntries: Record<ScoreCardEntryId, ScoreCardEntry> = {
    Aces: {
        id: 'Aces',
        name: 'Aces',
        description: 'Any number of "1"s',
        shopCost: 3,
        scoreFunc: (dice) => countNumbers(dice)[1],
    },
    Twos: {
        id: 'Twos',
        name: 'Twos',
        description: 'Any number of "2"s',
        shopCost: 3,
        scoreFunc: (dice) => countNumbers(dice)[2] * 2,
    },
    Threes: {
        id: 'Threes',
        name: 'Threes',
        description: 'Any number of "3"s',
        shopCost: 3,
        scoreFunc: (dice) => countNumbers(dice)[3] * 3,
    },
    Fours: {
        id: 'Fours',
        name: 'Fours',
        description: 'Any number of "4"s',
        shopCost: 3,
        scoreFunc: (dice) => countNumbers(dice)[4] * 4,
    },
    Fives: {
        id: 'Fives',
        name: 'Fives',
        description: 'Any number of "5"s',
        shopCost: 3,
        scoreFunc: (dice) => countNumbers(dice)[5] * 5,
    },
    Sixes: {
        id: 'Sixes',
        name: 'Sixes',
        description: 'Any number of "6"s',
        shopCost: 3,
        scoreFunc: (dice) => countNumbers(dice)[6] * 6,
    },
    Chance: {
        id: 'Chance',
        name: 'Chance',
        description: 'Sum of all dice',
        shopCost: 3,
        scoreFunc: (dice) => dice.reduce((acc, num) => acc + num, 0),
    },
    ThreeOfAKind: {
        id: 'ThreeOfAKind',
        name: 'Three of a Kind',
        description: 'At least three dice the same',
        shopCost: 3,
        scoreFunc: (dice) => {
            const threeOfAKind = Object.values(countNumbers(dice)).find((count) => count >= 3);
            return threeOfAKind ? dice.filter((die) => die !== null).reduce((acc, num) => acc + num, 0) : 0;
        },
    },
    FourOfAKind: {
        id: 'FourOfAKind',
        name: 'Four of a Kind',
        description: 'At least four dice the same',
        shopCost: 3,
        scoreFunc: (dice) => {
            const fourOfAKind = Object.values(countNumbers(dice)).find((count) => count >= 4);
            return fourOfAKind ? dice.filter((die) => die !== null).reduce((acc, num) => acc + num, 0) : 0;
        },
    },
    FullHouse: {
        id: 'FullHouse',
        name: 'Full House',
        description: 'Three of a kind and a pair',
        shopCost: 3,
        scoreFunc: (dice) => {
            const counts = countNumbers(dice);
            const threeOfAKind = Object.values(counts).find((count) => count === 3);
            const pair = Object.values(counts).find((count) => count === 2);
            return threeOfAKind && pair ? 25 : 0;
        },
    },
    SmallStraight: {
        id: 'SmallStraight',
        name: 'Small Straight',
        description: 'Four sequential dice',
        shopCost: 3,
        scoreFunc: (dice) => {
            const counts = countNumbers(dice);

            const isStraight = range(1, 3)
                .map((i) => range(i, i + 3))
                .some((range) => range.every((num) => counts[num as keyof NumberCounts] >= 1));

            return isStraight ? 30 : 0;
        },
    },
    LargeStraight: {
        id: 'LargeStraight',
        name: 'Large Straight',
        description: 'Five sequential dice',
        shopCost: 3,
        scoreFunc: (dice) => {
            const counts = countNumbers(dice);

            const isStraight = range(1, 2)
                .map((i) => range(i, i + 4))
                .some((range) => range.every((num) => counts[num as keyof NumberCounts] >= 1));

            return isStraight ? 40 : 0;
        },
    },
    Yahtzee: {
        id: 'Yahtzee',
        name: 'Yahtzee',
        description: 'All dice the same',
        shopCost: 3,
        scoreFunc: (dice) => (Object.values(countNumbers(dice)).some((count) => count === 5) ? 50 : 0),
    },
};
