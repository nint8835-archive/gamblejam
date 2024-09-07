import { WritableDraft } from 'immer';
import { ScoreCardEntries } from '../../definitions/scorecard';
import type { ShopState, Transition } from '../types';

export type BuyScoreCardEntryTransitionInvocation = {
    type: 'BuyScoreCardEntry';
    index: number;
};

export const BuyScoreCardEntryTransition: Transition<BuyScoreCardEntryTransitionInvocation> = {
    permittedStates: ['Shop'],
    invoke: (state, { index }) => {
        const shop = state.stateMachine as WritableDraft<ShopState>;
        const scoreCardEntryId = shop.availableScoreCardEntries[index];

        if (scoreCardEntryId === undefined) {
            throw new Error('Invalid score card entry index');
        }

        const scoreCardEntry = ScoreCardEntries[scoreCardEntryId];

        if (state.money < scoreCardEntry.shopCost) {
            throw new Error('Insufficient funds to purchase score card entry');
        }

        shop.availableScoreCardEntries = shop.availableScoreCardEntries.filter((_, i) => i !== index);
        state.money -= scoreCardEntry.shopCost;
        state.scoreCardContents.push(scoreCardEntryId);
    },
};

export type ExitShopTransitionInvocation = {
    type: 'ExitShop';
};

export const ExitShopTransition: Transition<ExitShopTransitionInvocation> = {
    permittedStates: ['Shop'],
    invoke: (state, _) => {
        state.stateMachine = {
            stage: 'ActiveGame',
            currentGame: {
                dice: [0, 0, 0, 0, 0],
                selectedDice: [],
                rerolls: 4,
                scoreCardValues: state.scoreCardContents.map((entryId) => ({ entryId, value: null })),
                totalScore: 0,
                targetScore: 100,
            },
        };
    },
};

export type ShopTransitionInvocations = BuyScoreCardEntryTransitionInvocation | ExitShopTransitionInvocation;

export const ShopTransitions = {
    BuyScoreCardEntry: BuyScoreCardEntryTransition,
    ExitShop: ExitShopTransition,
};
