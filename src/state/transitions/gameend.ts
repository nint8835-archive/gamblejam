import type { Transition } from '../types';

export type GameContinueInvocation = {
    type: 'Continue';
};

export const GameContinueTransition: Transition<GameContinueInvocation> = {
    permittedStates: ['GameWon'],
    invoke: (state, _) => {
        state.stateMachine = {
            stage: 'Shop',
        };
    },
};

export type GameEndTransitionInvocations = GameContinueInvocation;

export const GameEndTransitions = {
    Continue: GameContinueTransition,
};
