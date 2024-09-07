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
import { useStore } from '../state/state';
import type { ActiveGameState, StagedState } from '../state/types';
import { cn } from '../util';

function Die({ value, index }: { value: number; index: number }) {
    const {
        stateMachine: {
            currentGame: { selectedDice },
        },
        invoke,
    } = useStore() as StagedState<ActiveGameState>;
    const isSelected = selectedDice.includes(index);

    return (
        <div
            className={cn(
                'flex h-16 w-16 cursor-pointer items-center justify-center rounded-md border-2 border-zinc-50 text-2xl font-bold transition-all hover:border-4 hover:bg-sky-950',
                isSelected && 'bg-sky-800 hover:bg-sky-600',
            )}
            onClick={() => invoke({ type: 'ToggleDice', index })}
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
        stateMachine: {
            currentGame: { dice, scoreCardValues },
        },
        invoke,
    } = useStore() as StagedState<ActiveGameState>;
    const scoredValue = scoreCardValues[index].value;
    const locked = scoredValue !== null;
    const score = scoredValue === null ? scoreFunc(dice) : scoredValue;
    const nonScoring = score === 0 && !locked;

    return (
        <div
            className={cn(
                'flex flex-row items-center justify-between rounded-md border-2 border-zinc-600 p-2 transition-all',
                className,
                locked && 'bg-sky-800',
                !locked && 'cursor-pointer hover:bg-sky-950',
            )}
            onClick={() => invoke({ type: 'UpdateScoreCardValue', index, value: score })}
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
        stateMachine: {
            currentGame: { dice, totalScore, rerolls, selectedDice, scoreCardValues, targetScore },
        },
        invoke,
        devMode,
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

    const sortedScoreCardEntries = scoreCardValues
        .map((entry, index) => ({
            key: index,
            index,
            ...ScoreCardEntries[entry.entryId],
            score: ScoreCardEntries[entry.entryId].scoreFunc(dice),
            scoreCardValue: entry.value,
            locked: entry.value !== null,
        }))
        .sort((a, b) => {
            if (a.locked && !b.locked) {
                return 1;
            } else if (!a.locked && b.locked) {
                return -1;
            } else if (a.score !== b.score) {
                return b.score - a.score;
            } else {
                return a.name.localeCompare(b.name);
            }
        });

    function devModeWin() {
        invoke({
            type: 'ForceStageChange',
            newMachine: { stage: 'GameWon', totalEarnings: 0, unusedCardEarnings: 0 },
        });
    }

    function devModeLose() {
        invoke({
            type: 'ForceStageChange',
            newMachine: { stage: 'GameLost', totalScore, targetScore },
        });
    }

    return (
        <div className="flex h-screen grid-cols-2 flex-col items-center gap-2 md:grid md:h-auto">
            <div className="h-auto w-full space-y-4 p-4 md:w-auto">
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
                        onClick={() => invoke({ type: 'RollDice' })}
                        ref={refs.setReference}
                        {...getReferenceProps()}
                    >
                        <div className="flex flex-row">
                            <DicesIcon className="mr-2" /> Roll
                        </div>
                        <div className="italic text-red-300">({rerolls} rerolls)</div>
                    </button>
                    {isMounted && selectedDice.length === 0 && rerolls > 0 && (
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
                        onClick={() => invoke({ type: 'SortDice' })}
                    >
                        <ArrowUpDownIcon />
                    </button>
                </div>
            </div>

            <div className="flex min-h-0 flex-1 shrink grid-cols-2 flex-col gap-2 p-4 md:h-screen">
                <div className="flex flex-col justify-between md:flex-row">
                    <div className="flex flex-row items-center justify-between gap-2">
                        <div className="text-2xl font-black">Total score</div>
                        <div className="text-2xl font-medium">{totalScore}</div>
                    </div>
                    <div className="flex flex-row items-center justify-between gap-2">
                        <div className="text-2xl font-black">Target score</div>
                        <div className="text-2xl font-medium">{targetScore}</div>
                    </div>
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 overflow-auto">
                    {/* If something weird happens here, Dan told me so */}
                    {sortedScoreCardEntries.map((entry) => (
                        <ScoreCardEntry {...entry} />
                    ))}
                </div>
            </div>

            {devMode && (
                <div className="absolute bottom-0 left-0 space-x-2 p-4">
                    <button
                        className="rounded-md bg-green-700 px-4 py-2 transition-colors hover:bg-green-900"
                        onClick={devModeWin}
                    >
                        Win
                    </button>
                    <button
                        className="rounded-md bg-red-700 px-4 py-2 transition-colors hover:bg-red-900"
                        onClick={devModeLose}
                    >
                        Lose
                    </button>
                </div>
            )}
        </div>
    );
}
