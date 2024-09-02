import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { ScoreCardEntries, type ScoreCardEntryId } from '../definitions/scorecard';
import type { Actions, State } from './types';

export const useStore = create<State & Actions>()(
    devtools(
        immer((set) => ({
            stateMachine: {
                stage: 'MainMenu',
            },

            beginGame: () => {
                set(
                    (state) => {
                        if (state.stateMachine.stage !== 'MainMenu') {
                            throw new Error('Cannot begin game when not in the main menu');
                        }

                        state.stateMachine = {
                            stage: 'ActiveGame',
                            currentGame: {
                                dice: [0, 0, 0, 0, 0],
                                selectedDice: [],
                                rerolls: 4,

                                scoreCardValues: Object.keys(ScoreCardEntries).map((entryId) => ({
                                    entryId: entryId as ScoreCardEntryId,
                                    value: null,
                                })),
                                totalScore: 0,
                            },
                        };
                    },
                    undefined,
                    'beginGame',
                );
            },

            rollDice: () => {
                set(
                    (state) => {
                        if (state.stateMachine.stage !== 'ActiveGame') {
                            throw new Error('Cannot roll dice when not in an active game');
                        }

                        const currentGame = state.stateMachine.currentGame;

                        currentGame.dice = currentGame.dice.map((die, index) =>
                            currentGame.selectedDice.includes(index) || currentGame.selectedDice.length === 0
                                ? Math.floor(Math.random() * 6) + 1
                                : die,
                        );
                        currentGame.rerolls--;
                    },
                    undefined,
                    'rollDice',
                );
            },
            sortDice: () => {
                set(
                    (state) => {
                        if (state.stateMachine.stage !== 'ActiveGame') {
                            throw new Error('Cannot sort dice when not in an active game');
                        }

                        state.stateMachine.currentGame.dice = state.stateMachine.currentGame.dice.sort();
                        state.stateMachine.currentGame.selectedDice = [];
                    },
                    undefined,
                    'sortDice',
                );
            },
            toggleDice: (index) => {
                set(
                    (state) => {
                        if (state.stateMachine.stage !== 'ActiveGame') {
                            throw new Error('Cannot toggle dice when not in an active game');
                        }

                        state.stateMachine.currentGame.selectedDice =
                            state.stateMachine.currentGame.selectedDice.includes(index)
                                ? state.stateMachine.currentGame.selectedDice.filter((i) => i !== index)
                                : state.stateMachine.currentGame.selectedDice.concat(index);
                    },
                    undefined,
                    'toggleDice',
                );
            },
            unselectDice: () => {
                set(
                    (state) => {
                        if (state.stateMachine.stage !== 'ActiveGame') {
                            throw new Error('Cannot unselect dice when not in an active game');
                        }

                        state.stateMachine.currentGame.selectedDice = [];
                    },
                    undefined,
                    'unselectDice',
                );
            },
            resetRerolls: () => {
                set(
                    (state) => {
                        if (state.stateMachine.stage !== 'ActiveGame') {
                            throw new Error('Cannot reset rerolls when not in an active game');
                        }

                        state.stateMachine.currentGame.rerolls = 4;
                    },
                    undefined,
                    'resetReRolls',
                );
            },

            updateScoreCardValue: (index, value) => {
                set(
                    (state) => {
                        if (state.stateMachine.stage !== 'ActiveGame') {
                            throw new Error('Cannot update score card value when not in an active game');
                        }

                        state.stateMachine.currentGame.scoreCardValues[index].value = value;
                        state.stateMachine.currentGame.totalScore = state.stateMachine.currentGame.scoreCardValues
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
