import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type State = {
    dice: number[];
    selectedDice: number[];

    scoreCardEntries: (number | null)[];
    totalScore: number;
};

type Actions = {
    rollDice: () => void;
    sortDice: () => void;
    toggleDice: (index: number) => void;
    unselectDice: () => void;

    updateScoreCardEntry: (index: number, score: number) => void;
};

export const useStore = create<State & Actions>()(
    devtools(
        immer((set) => ({
            dice: [0, 0, 0, 0, 0],
            selectedDice: [],

            scoreCardEntries: Array(13).fill(null),
            totalScore: 0,

            rollDice: () => {
                set(
                    (state) => {
                        state.dice = state.dice.map((die, index) =>
                            state.selectedDice.includes(index) || state.selectedDice.length === 0
                                ? Math.floor(Math.random() * 6) + 1
                                : die,
                        );
                    },
                    undefined,
                    'rollDice',
                );
            },
            sortDice: () => {
                set(
                    (state) => {
                        state.dice = state.dice.sort();
                    },
                    undefined,
                    'sortDice',
                );
            },
            toggleDice: (index) => {
                set(
                    (state) => {
                        state.selectedDice = state.selectedDice.includes(index)
                            ? state.selectedDice.filter((i) => i !== index)
                            : state.selectedDice.concat(index);
                    },
                    undefined,
                    'toggleDice',
                );
            },
            unselectDice: () => {
                set(
                    (state) => {
                        state.selectedDice = [];
                    },
                    undefined,
                    'unselectDice',
                );
            },

            updateScoreCardEntry: (index, score) => {
                set(
                    (state) => {
                        state.scoreCardEntries[index] = score;
                        state.totalScore = state.scoreCardEntries
                            .filter((score) => score !== null)
                            .reduce((acc, score) => acc + score, 0);
                    },
                    undefined,
                    'updateScoreCardEntry',
                );
            },
        })),
    ),
);
