import { ScoreCardEntries, type ScoreCardEntryId } from '../../definitions/scorecard';
import { range } from '../../util';
import type { Transition } from '../types';

export type GameContinueInvocation = {
    type: 'Continue';
};

export const GameContinueTransition: Transition<GameContinueInvocation> = {
    permittedStates: ['GameWon'],
    invoke: (state, _) => {
        const allScoreCardEntries = Object.keys(ScoreCardEntries) as ScoreCardEntryId[];

        state.stateMachine = {
            stage: 'Shop',
            availableScoreCardEntries: range(0, 2).map(
                () => allScoreCardEntries[Math.floor(Math.random() * allScoreCardEntries.length)],
            ),
        };
    },
};

export type GameEndTransitionInvocations = GameContinueInvocation;

export const GameEndTransitions = {
    Continue: GameContinueTransition,
};
