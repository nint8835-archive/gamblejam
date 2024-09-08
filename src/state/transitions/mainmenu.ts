import type { Transition } from '../types';
import { RollDiceTransition } from './activegame';
import { createGame } from './utils';

export type BeginGameTransitionInvocation = {
    type: 'BeginGame';
};

export const BeginGameTransition: Transition<BeginGameTransitionInvocation> = {
    permittedStates: ['MainMenu'],
    invoke: (state, _) => {
        state.stateMachine = createGame(state);

        RollDiceTransition.invoke(state, { type: 'RollDice', rollAllDice: true });
    },
};

export type MainMenuTransitionInvocations = BeginGameTransitionInvocation;

export const MainMenuTransitions = {
    BeginGame: BeginGameTransition,
};
