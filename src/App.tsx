import { useState } from 'react';
import { cn } from './util';

function Die({ value }: { value: number | null }) {
    return (
        <div className="flex h-16 w-16 items-center justify-center rounded-md border-2 border-zinc-50 text-2xl font-bold">
            {value}
        </div>
    );
}

type ScoreCardEntryProps = {
    name: string;
    description: string;
    scoreFunc: (dice: (number | null)[]) => number;
    dice: (number | null)[];
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
        scoreFunc: (dice) => dice.filter((die) => die === 1).reduce((acc, num) => acc + num, 0),
    },
    {
        name: 'Twos',
        description: 'Any number of "2"s',
        scoreFunc: (dice) => dice.filter((die) => die === 2).reduce((acc, num) => acc + num, 0),
    },
    {
        name: 'Threes',
        description: 'Any number of "3"s',
        scoreFunc: (dice) => dice.filter((die) => die === 3).reduce((acc, num) => acc + num, 0),
    },
    {
        name: 'Fours',
        description: 'Any number of "4"s',
        scoreFunc: (dice) => dice.filter((die) => die === 4).reduce((acc, num) => acc + num, 0),
    },
    {
        name: 'Fives',
        description: 'Any number of "5"s',
        scoreFunc: (dice) => dice.filter((die) => die === 5).reduce((acc, num) => acc + num, 0),
    },
    {
        name: 'Sixes',
        description: 'Any number of "6"s',
        scoreFunc: (dice) => dice.filter((die) => die === 6).reduce((acc, num) => acc + num, 0),
    },
];

function App() {
    const [dice, setDice] = useState<(number | null)[]>([null, null, null, null, null]);

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

            <div className="space-y-2">
                {scoreCardEntries.map((entry) => (
                    <ScoreCardEntry key={entry.name} {...entry} dice={dice} />
                ))}
            </div>
        </div>
    );
}

export default App;
