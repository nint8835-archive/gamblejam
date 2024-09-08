import type { Transition } from '../types';
import { RollDiceTransition } from './activegame';

export type BeginGameTransitionInvocation = {
    type: 'BeginGame';
};

export const BeginGameTransition: Transition<BeginGameTransitionInvocation> = {
    permittedStates: ['MainMenu'],
    invoke: (state, _) => {
        state.stateMachine = {
            stage: 'ActiveGame',
            currentGame: {
                dice: [0, 0, 0, 0, 0],
                selectedDice: [],
                rerolls: state.rerolls + 1,

                scoreCardValues: state.scoreCardContents.map((entryId) => ({ entryId, value: null })),
                totalScore: 0,
                targetScore: 100,
            },
        };

        RollDiceTransition.invoke(state, { type: 'RollDice', rollAllDice: true });
    },
};

export type MainMenuTransitionInvocations = BeginGameTransitionInvocation;

export const MainMenuTransitions = {
    BeginGame: BeginGameTransition,
};
