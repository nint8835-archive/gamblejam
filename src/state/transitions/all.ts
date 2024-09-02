import type { WritableDraft } from 'immer';
import type { CompleteState, Transition } from '../types';
import { ActiveGameTransitionInvocations, ActiveGameTransitions } from './activegame';
import { type MainMenuTransitionInvocations, MainMenuTransitions } from './mainmenu';

export type TransitionInvocation = MainMenuTransitionInvocations | ActiveGameTransitionInvocations;

type OfUnion<T extends { type: string }> = {
    [P in T['type']]: Transition<Extract<T, { type: P }>>;
};

const transitions: OfUnion<TransitionInvocation> = {
    ...MainMenuTransitions,
    ...ActiveGameTransitions,
};

export function invokeTransition<T extends TransitionInvocation>(state: WritableDraft<CompleteState>, invocation: T) {
    // TODO: I've spent too long battling this type error. I feel like this type cast shouldn't be required.
    const transition = transitions[invocation.type] as Transition<T>;

    if (!transition.permittedStates.includes(state.stateMachine.stage)) {
        throw new Error(`Cannot invoke transition "${invocation.type}" when in stage "${state.stateMachine.stage}"`);
    }

    transition.invoke(state, invocation);
}
