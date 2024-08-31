import { ArrowUpDownIcon, DicesIcon } from 'lucide-react';
import { useStore } from './state';
import { cn, countNumbers, NumberCounts, range } from './util';

function Die({ value, index }: { value: number; index: number }) {
    const { toggleDice, selectedDice } = useStore();
    const isSelected = selectedDice.includes(index);

    return (
        <div
            className={cn(
                'flex h-16 w-16 cursor-pointer items-center justify-center rounded-md border-2 border-zinc-50 text-2xl font-bold transition-all hover:border-4 hover:bg-sky-950',
                isSelected && 'bg-sky-800 hover:bg-sky-600',
            )}
            onClick={() => toggleDice(index)}
        >
            {value}
        </div>
    );
}

type ScoreCardEntryProps = {
    name: string;
    description: string;
    scoreFunc: (dice: number[]) => number;
    index: number;
    className?: string;
};

function ScoreCardEntry({ name, description, scoreFunc, className, index }: ScoreCardEntryProps) {
    const { dice, scoreCardEntries, updateScoreCardEntry, rollDice, unselectDice, resetRerolls } = useStore();
    const scoredValue = scoreCardEntries[index];
    const locked = scoredValue !== null;
    const score = scoredValue === null ? scoreFunc(dice) : scoredValue;
    const nonScoring = score === 0 && !locked;

    function onClick() {
        if (locked) {
            return;
        }

        updateScoreCardEntry(index, score);
        unselectDice();
        resetRerolls();
        rollDice();
    }

    return (
        <div
            className={cn(
                'flex flex-row items-center justify-between rounded-md border-2 border-zinc-600 p-2 transition-all',
                className,
                locked && 'bg-sky-800',
                !locked && 'cursor-pointer hover:bg-sky-950',
            )}
            onClick={onClick}
        >
            <div>
                <div className={cn('text-2xl font-bold transition-colors', nonScoring && 'text-zinc-500')}>{name}</div>
                <div className="italic text-zinc-400">{description}</div>
            </div>
            <div className={cn('text-xl font-medium transition-colors', nonScoring && 'text-zinc-500')}>{score}</div>
        </div>
    );
}

const scoreCardEntries: Omit<ScoreCardEntryProps, 'dice' | 'index'>[] = [
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
        className: 'col-span-2',
    },
];

function App() {
    const { dice, rollDice, sortDice, totalScore, rerolls } = useStore();

    function roll() {
        if (rerolls > 0) {
            rollDice();
        }
    }

    return (
        <div className="grid items-center justify-center gap-2 p-4 sm:grid-cols-1 md:grid-cols-2">
            <div className="space-y-4">
                <div className="flex w-full flex-row justify-between gap-2">
                    {dice.map((value, index) => (
                        <Die key={index} value={value} index={index} />
                    ))}
                </div>
                <div className="flex flex-row gap-2">
                    <button
                        className={cn(
                            'flex h-full flex-1 flex-col items-center justify-center rounded-md bg-gradient-to-b from-red-500 to-red-800 p-4',
                            rerolls > 0 && 'hover:from-red-600 hover:to-red-900',
                            rerolls === 0 && 'cursor-not-allowed from-red-800 to-red-950',
                        )}
                        onClick={roll}
                    >
                        <div className="flex flex-row">
                            <DicesIcon className="mr-2" /> Roll
                        </div>
                        <div className="italic text-red-300">({rerolls} rerolls)</div>
                    </button>
                    <button
                        className="flex aspect-square h-full items-center justify-center rounded-md bg-gradient-to-b from-emerald-500 to-emerald-800 p-7 hover:from-emerald-600 hover:to-emerald-900"
                        onClick={sortDice}
                    >
                        <ArrowUpDownIcon />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {scoreCardEntries.map((entry, index) => (
                    <ScoreCardEntry key={entry.name} index={index} {...entry} />
                ))}
                <div className="col-span-2 flex flex-row items-center justify-between gap-2">
                    <div className="text-2xl font-black">Total score</div>
                    <div className="text-2xl font-semibold">{totalScore}</div>
                </div>
            </div>
        </div>
    );
}

export default App;
