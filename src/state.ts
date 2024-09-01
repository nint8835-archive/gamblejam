import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { ScoreCardEntries, type ScoreCardEntryId } from './definitions/scorecard';

export type MainMenuState = {
    stage: 'MainMenu';
};

type ScoreCardValue = {
    entryId: ScoreCardEntryId;
    value: number | null;
};

type Game = {
    dice: number[];
    selectedDice: number[];
    rerolls: number;

    scoreCardValues: ScoreCardValue[];
    totalScore: number;
};

export type ActiveGameState = {
    stage: 'ActiveGame';
    currentGame: Game;
};

type StagedStates = MainMenuState | ActiveGameState;

export type Stage = StagedStates['stage'];

type GlobalStateValues = {};

type State = GlobalStateValues & StagedStates;

type Actions = {
    beginGame: () => void;

    rollDice: () => void;
    sortDice: () => void;
    toggleDice: (index: number) => void;
    unselectDice: () => void;
    resetRerolls: () => void;

    updateScoreCardValue: (index: number, value: number) => void;
};

export type StagedState<T extends StagedStates> = T & GlobalStateValues & Actions;

export const useStore = create<State & Actions>()(
    devtools(
        immer((set) => ({
            stage: 'MainMenu',

            beginGame: () => {
                set((state) => {
                    if (state.stage !== 'MainMenu') {
                        throw new Error('Cannot begin game when not in the main menu');
                    }

                    const newState = state as any as ActiveGameState;

                    newState.stage = 'ActiveGame';
                    newState.currentGame = {
                        dice: [0, 0, 0, 0, 0],
                        selectedDice: [],
                        rerolls: 4,

                        scoreCardValues: Object.keys(ScoreCardEntries).map((entryId) => ({
                            entryId: entryId as ScoreCardEntryId,
                            value: null,
                        })),
                        totalScore: 0,
                    };
                });
            },

            rollDice: () => {
                set(
                    (state) => {
                        if (state.stage !== 'ActiveGame') {
                            throw new Error('Cannot roll dice when not in an active game');
                        }

                        state.currentGame.dice = state.currentGame.dice.map((die, index) =>
                            state.currentGame.selectedDice.includes(index) ||
                            state.currentGame.selectedDice.length === 0
                                ? Math.floor(Math.random() * 6) + 1
                                : die,
                        );
                        state.currentGame.rerolls--;
                    },
                    undefined,
                    'rollDice',
                );
            },
            sortDice: () => {
                set(
                    (state) => {
                        if (state.stage !== 'ActiveGame') {
                            throw new Error('Cannot sort dice when not in an active game');
                        }

                        state.currentGame.dice = state.currentGame.dice.sort();
                        state.currentGame.selectedDice = [];
                    },
                    undefined,
                    'sortDice',
                );
            },
            toggleDice: (index) => {
                set(
                    (state) => {
                        if (state.stage !== 'ActiveGame') {
                            throw new Error('Cannot toggle dice when not in an active game');
                        }

                        state.currentGame.selectedDice = state.currentGame.selectedDice.includes(index)
                            ? state.currentGame.selectedDice.filter((i) => i !== index)
                            : state.currentGame.selectedDice.concat(index);
                    },
                    undefined,
                    'toggleDice',
                );
            },
            unselectDice: () => {
                set(
                    (state) => {
                        if (state.stage !== 'ActiveGame') {
                            throw new Error('Cannot unselect dice when not in an active game');
                        }

                        state.currentGame.selectedDice = [];
                    },
                    undefined,
                    'unselectDice',
                );
            },
            resetRerolls: () => {
                set(
                    (state) => {
                        if (state.stage !== 'ActiveGame') {
                            throw new Error('Cannot reset rerolls when not in an active game');
                        }

                        state.currentGame.rerolls = 4;
                    },
                    undefined,
                    'resetReRolls',
                );
            },

            updateScoreCardValue: (index, value) => {
                set(
                    (state) => {
                        if (state.stage !== 'ActiveGame') {
                            throw new Error('Cannot update score card value when not in an active game');
                        }

                        state.currentGame.scoreCardValues[index].value = value;
                        state.currentGame.totalScore = state.currentGame.scoreCardValues
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
