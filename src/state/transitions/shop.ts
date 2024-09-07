import { WritableDraft } from 'immer';
import { ScoreCardEntries, type ScoreCardEntryId } from '../../definitions/scorecard';
import { range } from '../../util';
import type { ShopState, StagedState, State, Transition } from '../types';

export function rollShop(state: WritableDraft<State>): ShopState {
    const allScoreCardEntries = Object.keys(ScoreCardEntries) as ScoreCardEntryId[];

    const currentRerollCost = state.stateMachine.stage === 'Shop' ? state.stateMachine.rerollCost : 1;

    return {
        stage: 'Shop',
        rerollCost: Math.ceil(currentRerollCost * 1.35),
        availableScoreCardEntries: range(0, 2).map(
            () => allScoreCardEntries[Math.floor(Math.random() * allScoreCardEntries.length)],
        ),
    };
}

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

export type RerollShopTransitionInvocation = {
    type: 'RerollShop';
};

export const RerollShopTransition: Transition<RerollShopTransitionInvocation> = {
    permittedStates: ['Shop'],
    invoke: (state, _) => {
        const currentState = state as WritableDraft<StagedState<ShopState>>;

        if (currentState.stateMachine.rerollCost > currentState.money) {
            throw new Error('Insufficient funds to reroll shop');
        }

        currentState.money -= currentState.stateMachine.rerollCost;
        currentState.stateMachine = rollShop(state);
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

export type ShopTransitionInvocations =
    | BuyScoreCardEntryTransitionInvocation
    | RerollShopTransitionInvocation
    | ExitShopTransitionInvocation;

export const ShopTransitions = {
    BuyScoreCardEntry: BuyScoreCardEntryTransition,
    RerollShop: RerollShopTransition,
    ExitShop: ExitShopTransition,
};
