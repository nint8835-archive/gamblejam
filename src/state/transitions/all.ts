import type { WritableDraft } from 'immer';
import type { CompleteState, StateMachine, Transition } from '../types';
import { ActiveGameTransitionInvocations, ActiveGameTransitions } from './activegame';
import { GameEndTransitionInvocations, GameEndTransitions } from './gameend';
import { MainMenuTransitions, type MainMenuTransitionInvocations } from './mainmenu';
import { ShopTransitions, type ShopTransitionInvocations } from './shop';

export type ForceStageChangeTransitionInvocation = {
    type: 'ForceStageChange';
    newMachine: StateMachine;
};

export type TransitionInvocation =
    | MainMenuTransitionInvocations
    | ActiveGameTransitionInvocations
    | GameEndTransitionInvocations
    | ShopTransitionInvocations
    | ForceStageChangeTransitionInvocation;

type TransitionHandlers<T extends { type: string }> = {
    [P in T['type']]: Transition<Extract<T, { type: P }>>;
};

const transitions: TransitionHandlers<TransitionInvocation> = {
    ...MainMenuTransitions,
    ...ActiveGameTransitions,
    ...GameEndTransitions,
    ...ShopTransitions,

    ForceStageChange: {
        permittedStates: ['MainMenu', 'ActiveGame', 'GameLost', 'GameWon', 'Shop'],
        invoke: (state, invocation) => {
            state.stateMachine = invocation.newMachine;
        },
    },
};

export function invokeTransition<T extends TransitionInvocation>(state: WritableDraft<CompleteState>, invocation: T) {
    // TODO: I've spent too long battling this type error. I feel like this type cast shouldn't be required.
    const transition = transitions[invocation.type] as Transition<T>;

    if (transition.permittedStates && !transition.permittedStates.includes(state.stateMachine.stage)) {
        throw new Error(`Cannot invoke transition "${invocation.type}" when in stage "${state.stateMachine.stage}"`);
    }

    transition.invoke(state, invocation);
}
