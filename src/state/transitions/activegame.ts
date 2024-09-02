import type { WritableDraft } from 'immer';
import type { ActiveGameState, Transition } from '../types';

export type RollDiceTransitionInvocation = {
    type: 'RollDice';
};

export const RollDiceTransition: Transition<RollDiceTransitionInvocation> = {
    permittedStates: ['ActiveGame'],
    invoke: (state, _) => {
        const currentGame = (state.stateMachine as WritableDraft<ActiveGameState>).currentGame;

        currentGame.dice = currentGame.dice.map((die, index) =>
            currentGame.selectedDice.includes(index) || currentGame.selectedDice.length === 0
                ? Math.floor(Math.random() * 6) + 1
                : die,
        );
        currentGame.rerolls--;
    },
};

export type SortDiceTransitionInvocation = {
    type: 'SortDice';
};

export const SortDiceTransition: Transition<SortDiceTransitionInvocation> = {
    permittedStates: ['ActiveGame'],
    invoke: (state, _) => {
        const currentGame = (state.stateMachine as WritableDraft<ActiveGameState>).currentGame;

        currentGame.dice = currentGame.dice.sort();
        currentGame.selectedDice = [];
    },
};

export type ToggleDiceTransitionInvocation = {
    type: 'ToggleDice';
    index: number;
};

export const ToggleDiceTransition: Transition<ToggleDiceTransitionInvocation> = {
    permittedStates: ['ActiveGame'],
    invoke: (state, { index }) => {
        const currentGame = (state.stateMachine as WritableDraft<ActiveGameState>).currentGame;

        currentGame.selectedDice = currentGame.selectedDice.includes(index)
            ? currentGame.selectedDice.filter((i) => i !== index)
            : currentGame.selectedDice.concat(index);
    },
};

export type UnselectDiceTransitionInvocation = {
    type: 'UnselectDice';
};

export const UnselectDiceTransition: Transition<UnselectDiceTransitionInvocation> = {
    permittedStates: ['ActiveGame'],
    invoke: (state, _) => {
        const currentGame = (state.stateMachine as WritableDraft<ActiveGameState>).currentGame;

        currentGame.selectedDice = [];
    },
};

export type ResetRerollsTransitionInvocation = {
    type: 'ResetRerolls';
};

export const ResetRerollsTransition: Transition<ResetRerollsTransitionInvocation> = {
    permittedStates: ['ActiveGame'],
    invoke: (state, _) => {
        const currentGame = (state.stateMachine as WritableDraft<ActiveGameState>).currentGame;

        currentGame.rerolls = 4;
    },
};

export type UpdateScoreCardValueTransitionInvocation = {
    type: 'UpdateScoreCardValue';
    index: number;
    value: number;
};

export const UpdateScoreCardValueTransition: Transition<UpdateScoreCardValueTransitionInvocation> = {
    permittedStates: ['ActiveGame'],
    invoke: (state, { index, value }) => {
        const currentGame = (state.stateMachine as WritableDraft<ActiveGameState>).currentGame;

        currentGame.scoreCardValues[index].value = value;
        currentGame.totalScore = currentGame.scoreCardValues
            .map(({ value }) => value)
            .filter((score) => score !== null)
            .reduce((acc, score) => acc + score, 0);
    },
};

export type ActiveGameTransitionInvocations =
    | RollDiceTransitionInvocation
    | SortDiceTransitionInvocation
    | ToggleDiceTransitionInvocation
    | UnselectDiceTransitionInvocation
    | ResetRerollsTransitionInvocation
    | UpdateScoreCardValueTransitionInvocation;

export const ActiveGameTransitions = {
    RollDice: RollDiceTransition,
    SortDice: SortDiceTransition,
    ToggleDice: ToggleDiceTransition,
    UnselectDice: UnselectDiceTransition,
    ResetRerolls: ResetRerollsTransition,
    UpdateScoreCardValue: UpdateScoreCardValueTransition,
};
