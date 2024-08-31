import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type State = {
    dice: number[];

    scoreCardEntries: (number | null)[];
};

type Actions = {
    rollDice: () => void;
    sortDice: () => void;

    updateScoreCardEntry: (index: number, score: number) => void;
};

export const useStore = create<State & Actions>()(
    devtools(
        immer((set) => ({
            dice: [0, 0, 0, 0, 0],
            scoreCardEntries: Array(13).fill(null),

            rollDice: () => {
                set(
                    (state) => {
                        state.dice = state.dice.map(() => Math.floor(Math.random() * 6) + 1);
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

            updateScoreCardEntry: (index, score) => {
                set(
                    (state) => {
                        state.scoreCardEntries[index] = score;
                    },
                    undefined,
                    'updateScoreCardEntry',
                );
            },
        })),
    ),
);
