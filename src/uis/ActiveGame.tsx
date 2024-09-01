import {
    arrow,
    FloatingArrow,
    offset,
    useFloating,
    useHover,
    useInteractions,
    useTransitionStyles,
} from '@floating-ui/react';
import { ArrowUpDownIcon, DicesIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { ScoreCardEntries, ScoreCardEntry as ScoreCardEntryType } from '../definitions/scorecard';
import { ActiveGameState, StagedState, useStore } from '../state';
import { cn } from '../util';

function Die({ value, index }: { value: number; index: number }) {
    const {
        toggleDice,
        currentGame: { selectedDice },
    } = useStore() as StagedState<ActiveGameState>;
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

type ScoreCardEntryProps = ScoreCardEntryType & {
    index: number;
    className?: string;
};

function ScoreCardEntry({ name, description, scoreFunc, className, index }: ScoreCardEntryProps) {
    const {
        currentGame: { dice, scoreCardValues },
        rollDice,
        unselectDice,
        resetRerolls,
        updateScoreCardValue,
    } = useStore() as StagedState<ActiveGameState>;
    const scoredValue = scoreCardValues[index].value;
    const locked = scoredValue !== null;
    const score = scoredValue === null ? scoreFunc(dice) : scoredValue;
    const nonScoring = score === 0 && !locked;

    function onClick() {
        if (locked) {
            return;
        }

        updateScoreCardValue(index, score);
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

export function ActiveGameUi() {
    const {
        currentGame: { dice, totalScore, rerolls, selectedDice, scoreCardValues },
        rollDice,
        sortDice,
    } = useStore() as StagedState<ActiveGameState>;
    const [isOpen, setIsOpen] = useState(false);
    const arrowRef = useRef(null);
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [arrow({ element: arrowRef }), offset(7)],
    });
    const { isMounted, styles: transitionStyles } = useTransitionStyles(context);
    const hover = useHover(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

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
                        ref={refs.setReference}
                        {...getReferenceProps()}
                    >
                        <div className="flex flex-row">
                            <DicesIcon className="mr-2" /> Roll
                        </div>
                        <div className="italic text-red-300">({rerolls} rerolls)</div>
                    </button>
                    {isMounted && selectedDice.length === 0 && (
                        <div
                            ref={refs.setFloating}
                            style={{ ...floatingStyles, ...transitionStyles }}
                            {...getFloatingProps()}
                        >
                            <FloatingArrow ref={arrowRef} context={context} fill="#3f3f46" />
                            <div className="rounded-md bg-zinc-700 p-2 text-center">
                                You have no dice selected, so all dice will be rolled.
                                <br />
                                Click a die to select the dice to reroll.
                            </div>
                        </div>
                    )}
                    <button
                        className="flex aspect-square h-full items-center justify-center rounded-md bg-gradient-to-b from-emerald-500 to-emerald-800 p-7 hover:from-emerald-600 hover:to-emerald-900"
                        onClick={sortDice}
                    >
                        <ArrowUpDownIcon />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {scoreCardValues.map((entry, index) => (
                    <ScoreCardEntry key={index} index={index} {...ScoreCardEntries[entry.entryId]} />
                ))}
                <div className="col-span-2 flex flex-row items-center justify-between gap-2">
                    <div className="text-2xl font-black">Total score</div>
                    <div className="text-2xl font-semibold">{totalScore}</div>
                </div>
            </div>
        </div>
    );
}
