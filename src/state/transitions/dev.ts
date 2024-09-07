import type { StateMachine, Transition } from '../types';

export type ForceStageChangeTransitionInvocation = {
    type: 'ForceStageChange';
    newMachine: StateMachine;
};

export const ForceStageChangeTransition: Transition<ForceStageChangeTransitionInvocation> = {
    permittedStates: ['MainMenu', 'ActiveGame', 'GameLost', 'GameWon', 'Shop'],
    invoke: (state, invocation) => {
        state.stateMachine = invocation.newMachine;
    },
};

export type SetMoneyTransitionInvocation = {
    type: 'SetMoney';
    amount: number;
};

export const SetMoneyTransition: Transition<SetMoneyTransitionInvocation> = {
    permittedStates: ['Shop'],
    invoke: (state, { amount }) => {
        state.money = amount;
    },
};

export type DevTransitionInvocations = ForceStageChangeTransitionInvocation | SetMoneyTransitionInvocation;

export const DevTransitions = {
    ForceStageChange: ForceStageChangeTransition,
    SetMoney: SetMoneyTransition,
};
