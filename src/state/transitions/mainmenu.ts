import { ScoreCardEntries, type ScoreCardEntryId } from '../../definitions/scorecard';
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
                rerolls: 4,

                scoreCardValues: Object.keys(ScoreCardEntries).map((entryId) => ({
                    entryId: entryId as ScoreCardEntryId,
                    value: null,
                })),
                totalScore: 0,
            },
        };

        RollDiceTransition.invoke(state, { type: 'RollDice' });
    },
};

export type MainMenuTransitionInvocations = BeginGameTransitionInvocation;

export const MainMenuTransitions = {
    BeginGame: BeginGameTransition,
};
