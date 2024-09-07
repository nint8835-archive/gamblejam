import type { Transition } from '../types';
import { rollShop } from './shop';

export type GameContinueInvocation = {
    type: 'Continue';
};

export const GameContinueTransition: Transition<GameContinueInvocation> = {
    permittedStates: ['GameWon'],
    invoke: (state, _) => {
        state.stateMachine = rollShop(state);
    },
};

export type GameEndTransitionInvocations = GameContinueInvocation;

export const GameEndTransitions = {
    Continue: GameContinueTransition,
};
