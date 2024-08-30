import { useState } from 'react';
import { cn, countNumbers, NumberCounts, range } from './util';

function Die({ value }: { value: number }) {
    return (
        <div className="flex h-16 w-16 items-center justify-center rounded-md border-2 border-zinc-50 text-2xl font-bold">
            {value}
        </div>
    );
}

type ScoreCardEntryProps = {
    name: string;
    description: string;
    scoreFunc: (dice: number[]) => number;
    dice: number[];
};

function ScoreCardEntry({ name, description, scoreFunc, dice }: ScoreCardEntryProps) {
    const score = scoreFunc(dice);

    return (
        <div className="flex flex-row items-center justify-between rounded-md border-2 border-zinc-600 p-2">
            <div>
                <div className={cn('text-2xl font-bold', score === 0 && 'text-zinc-500')}>{name}</div>
                <div className="italic text-zinc-400">{description}</div>
            </div>
            <div className={cn('text-xl font-medium', score === 0 && 'text-zinc-500')}>{score}</div>
        </div>
    );
}

const scoreCardEntries: Omit<ScoreCardEntryProps, 'dice'>[] = [
    {
        name: 'Aces',
        description: 'Any number of "1"s',
        scoreFunc: (dice) => countNumbers(dice)[1],
    },
    {
        name: 'Twos',
        description: 'Any number of "2"s',
        scoreFunc: (dice) => countNumbers(dice)[2] * 2,
    },
    {
        name: 'Threes',
        description: 'Any number of "3"s',
        scoreFunc: (dice) => countNumbers(dice)[3] * 3,
    },
    {
        name: 'Fours',
        description: 'Any number of "4"s',
        scoreFunc: (dice) => countNumbers(dice)[4] * 4,
    },
    {
        name: 'Fives',
        description: 'Any number of "5"s',
        scoreFunc: (dice) => countNumbers(dice)[5] * 5,
    },
    {
        name: 'Sixes',
        description: 'Any number of "6"s',
        scoreFunc: (dice) => countNumbers(dice)[6] * 6,
    },
    {
        name: 'Chance',
        description: 'Sum of all dice',
        scoreFunc: (dice) => dice.reduce((acc, num) => acc + num, 0),
    },
    {
        name: 'Three of a Kind',
        description: 'At least three dice the same',
        scoreFunc: (dice) => {
            const threeOfAKind = Object.values(countNumbers(dice)).find((count) => count >= 3);
            return threeOfAKind ? dice.filter((die) => die !== null).reduce((acc, num) => acc + num, 0) : 0;
        },
    },
    {
        name: 'Four of a Kind',
        description: 'At least four dice the same',
        scoreFunc: (dice) => {
            const fourOfAKind = Object.values(countNumbers(dice)).find((count) => count >= 4);
            return fourOfAKind ? dice.filter((die) => die !== null).reduce((acc, num) => acc + num, 0) : 0;
        },
    },
    {
        name: 'Full House',
        description: 'Three of a kind and a pair',
        scoreFunc: (dice) => {
            const counts = countNumbers(dice);
            const threeOfAKind = Object.values(counts).find((count) => count === 3);
            const pair = Object.values(counts).find((count) => count === 2);
            return threeOfAKind && pair ? 25 : 0;
        },
    },
    {
        name: 'Small Straight',
        description: 'Four sequential dice',
        scoreFunc: (dice) => {
            const counts = countNumbers(dice);

            const isStraight = range(1, 3)
                .map((i) => range(i, i + 3))
                .some((range) => range.every((num) => counts[num as keyof NumberCounts] >= 1));

            return isStraight ? 30 : 0;
        },
    },
    {
        name: 'Large Straight',
        description: 'Five sequential dice',
        scoreFunc: (dice) => {
            const counts = countNumbers(dice);

            const isStraight = range(1, 2)
                .map((i) => range(i, i + 4))
                .some((range) => range.every((num) => counts[num as keyof NumberCounts] >= 1));

            return isStraight ? 40 : 0;
        },
    },
    {
        name: 'Yahtzee',
        description: 'All dice the same',
        scoreFunc: (dice) => {
            const allSame = Object.values(countNumbers(dice)).find((count) => count === 5);
            return allSame ? 50 : 0;
        },
    },
];

function App() {
    const [dice, setDice] = useState<number[]>([0, 0, 0, 0, 0]);

    function roll() {
        setDice(dice.map(() => Math.floor(Math.random() * 6) + 1));
    }

    return (
        <div className="grid items-center justify-center gap-2 p-4 sm:grid-cols-1 md:grid-cols-2">
            <div className="space-y-4">
                <div className="flex w-full flex-row justify-between gap-2">
                    {dice.map((value, index) => (
                        <Die key={index} value={value} />
                    ))}
                </div>
                <button
                    className="w-full rounded-md bg-gradient-to-b from-red-500 to-red-800 p-4 transition-all duration-1000 hover:from-red-600 hover:to-red-900"
                    onClick={roll}
                >
                    Roll
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {scoreCardEntries.map((entry) => (
                    <ScoreCardEntry key={entry.name} {...entry} dice={dice} />
                ))}
            </div>
        </div>
    );
}

export default App;
