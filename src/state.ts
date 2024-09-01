import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { ScoreCardEntries, type ScoreCardEntryId } from './definitions/scorecard';

type ScoreCardValue = {
    entryId: ScoreCardEntryId;
    value: number | null;
};

type State = {
    dice: number[];
    selectedDice: number[];
    rerolls: number;

    scoreCardValues: ScoreCardValue[];
    totalScore: number;
};

type Actions = {
    rollDice: () => void;
    sortDice: () => void;
    toggleDice: (index: number) => void;
    unselectDice: () => void;
    resetRerolls: () => void;

    updateScoreCardValue: (index: number, value: number) => void;
};

export const useStore = create<State & Actions>()(
    devtools(
        immer((set) => ({
            dice: [0, 0, 0, 0, 0],
            selectedDice: [],
            rerolls: 4,

            scoreCardValues: Object.keys(ScoreCardEntries).map((entryId) => ({
                entryId: entryId as ScoreCardEntryId,
                value: null,
            })),
            totalScore: 0,

            rollDice: () => {
                set(
                    (state) => {
                        state.dice = state.dice.map((die, index) =>
                            state.selectedDice.includes(index) || state.selectedDice.length === 0
                                ? Math.floor(Math.random() * 6) + 1
                                : die,
                        );
                        state.rerolls--;
                    },
                    undefined,
                    'rollDice',
                );
            },
            sortDice: () => {
                set(
                    (state) => {
                        state.dice = state.dice.sort();
                        state.selectedDice = [];
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
            resetRerolls: () => {
                set(
                    (state) => {
                        state.rerolls = 4;
                    },
                    undefined,
                    'resetReRolls',
                );
            },

            updateScoreCardValue: (index, value) => {
                set(
                    (state) => {
                        state.scoreCardValues[index].value = value;
                        state.totalScore = state.scoreCardValues
                            .map(({ value }) => value)
                            .filter((score) => score !== null)
                            .reduce((acc, score) => acc + score, 0);
                    },
                    undefined,
                    'updateScoreCardValue',
                );
            },
        })),
    ),
);
