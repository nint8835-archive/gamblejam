import type { WritableDraft } from 'immer';
import type { ActiveGameState, Transition } from '../types';

export type RollDiceTransitionInvocation = {
    type: 'RollDice';
    rollAllDice?: boolean;
};

export const RollDiceTransition: Transition<RollDiceTransitionInvocation> = {
    permittedStates: ['ActiveGame'],
    invoke: (state, { rollAllDice }) => {
        const currentGame = (state.stateMachine as WritableDraft<ActiveGameState>).currentGame;

        if (!rollAllDice && (currentGame.selectedDice.length < 1 || currentGame.selectedDice.length > 5)) {
            throw new Error('Cannot roll dice with less than 1 or more than 5 selected dice');
        }

        if (currentGame.rerolls <= 0) {
            throw new Error('Cannot roll dice with no rerolls remaining');
        }

        currentGame.dice = currentGame.dice.map((die, index) =>
            currentGame.selectedDice.includes(index) || rollAllDice ? Math.floor(Math.random() * 6) + 1 : die,
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
        const selectedDiceCount = currentGame.selectedDice.length;
        const isDiceSelected = currentGame.selectedDice.includes(index);

        if (selectedDiceCount === 5 && !isDiceSelected) {
            throw new Error('Cannot select more than 5 dice');
        }

        currentGame.selectedDice = isDiceSelected
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

        currentGame.rerolls = state.rerolls + 1;
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

        if (currentGame.scoreCardValues[index].value !== null) {
            throw new Error(`Cannot update score card value for index ${index} as it is already set`);
        }

        currentGame.scoreCardValues[index].value = value;
        currentGame.totalScore = currentGame.scoreCardValues
            .map(({ value }) => value)
            .filter((score) => score !== null)
            .reduce((acc, score) => acc + score, 0);

        if (currentGame.totalScore >= currentGame.targetScore) {
            const unusedCardEntries = currentGame.scoreCardValues.filter(({ value }) => value === null).length;

            const moneyEarned = unusedCardEntries;

            state.stateMachine = {
                stage: 'GameWon',
                unusedCardEarnings: moneyEarned,
                totalEarnings: moneyEarned,
            };
            state.money += moneyEarned;
            state.completedGames++;
            return;
        }

        if (currentGame.scoreCardValues.some(({ value }) => value === null)) {
            ResetRerollsTransition.invoke(state, { type: 'ResetRerolls' });
            UnselectDiceTransition.invoke(state, { type: 'UnselectDice' });
            RollDiceTransition.invoke(state, { type: 'RollDice', rollAllDice: true });
        } else {
            state.stateMachine = {
                stage: 'GameLost',
                totalScore: currentGame.totalScore,
                targetScore: currentGame.targetScore,
            };
        }
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
