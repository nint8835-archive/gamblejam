import { Loadouts, type LoadoutId } from '../../definitions/loadouts';
import { type ScoreCardEntryId } from '../../definitions/scorecard';
import type { Transition } from '../types';
import { RollDiceTransition } from './activegame';
import { createGame } from './utils';

export type SelectLoadoutTransitionInvocation = {
    type: 'SelectLoadout';
    loadout: LoadoutId;
};

export const SelectLoadoutTransition: Transition<SelectLoadoutTransitionInvocation> = {
    permittedStates: ['LoadoutSelect'],
    invoke: (state, invocation) => {
        const { dice, rerolls, scoreCardEntries } = Loadouts[invocation.loadout];

        const scoreCardContents = Object.entries(scoreCardEntries).flatMap(([entry, count]) =>
            Array(count).fill(entry as ScoreCardEntryId),
        );

        state.dice = dice;
        state.rerolls = rerolls;
        state.scoreCardContents = scoreCardContents;

        state.stateMachine = createGame(state);
        RollDiceTransition.invoke(state, { type: 'RollDice', rollAllDice: true });
    },
};

export type LoadoutSelectTransitionInvocations = SelectLoadoutTransitionInvocation;

export const LoadoutSelectTransitions = {
    SelectLoadout: SelectLoadoutTransition,
};
