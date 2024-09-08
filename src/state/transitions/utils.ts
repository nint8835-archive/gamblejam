import { WritableDraft } from 'immer';
import { type ItemId, Items } from '../../definitions/items';
import { ScoreCardEntries, type ScoreCardEntryId } from '../../definitions/scorecard';
import { range } from '../../util';
import type { ActiveGameState, ShopState, State } from '../types';

export function rollShop(state: WritableDraft<State>): ShopState {
    const allScoreCardEntries = Object.keys(ScoreCardEntries) as ScoreCardEntryId[];
    const allItems = Object.keys(Items) as ItemId[];

    const currentRerollCost = state.stateMachine.stage === 'Shop' ? state.stateMachine.rerollCost : 1;

    return {
        stage: 'Shop',
        rerollCost: Math.ceil(currentRerollCost * 1.35),
        availableScoreCardEntries: range(0, 2).map(
            () => allScoreCardEntries[Math.floor(Math.random() * allScoreCardEntries.length)],
        ),
        availableItems: range(0, 2).map(() => allItems[Math.floor(Math.random() * allItems.length)]),
    };
}

export function createGame(state: WritableDraft<State>): ActiveGameState {
    return {
        stage: 'ActiveGame',
        currentGame: {
            dice: [0, 0, 0, 0, 0],
            selectedDice: [],
            rerolls: state.rerolls + 1,

            scoreCardValues: state.scoreCardContents.map((entryId) => ({ entryId, value: null })),
            totalScore: 0,
            targetScore: 100 * Math.pow(1.35, state.completedGames),
        },
    };
}
