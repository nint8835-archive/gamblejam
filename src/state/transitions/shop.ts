import { WritableDraft } from 'immer';
import { Items } from '../../definitions/items';
import { ScoreCardEntries } from '../../definitions/scorecard';
import type { ShopState, StagedState, Transition } from '../types';
import { RollDiceTransition } from './activegame';
import { createGame, rollShop } from './utils';

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

export type BuyItemTransitionInvocation = {
    type: 'BuyItem';
    index: number;
};

export const BuyItemTransition: Transition<BuyItemTransitionInvocation> = {
    permittedStates: ['Shop'],
    invoke: (state, { index }) => {
        const shop = state.stateMachine as WritableDraft<ShopState>;
        const itemId = shop.availableItems[index];

        if (itemId === undefined) {
            throw new Error('Invalid item index');
        }

        const item = Items[itemId];

        if (state.money < item.shopCost) {
            throw new Error('Insufficient funds to purchase item');
        }

        shop.availableItems = shop.availableItems.filter((_, i) => i !== index);
        state.money -= item.shopCost;
        item.effect(state);
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
        state.stateMachine = createGame(state);

        RollDiceTransition.invoke(state, { type: 'RollDice', rollAllDice: true });
    },
};

export type ShopTransitionInvocations =
    | BuyScoreCardEntryTransitionInvocation
    | BuyItemTransitionInvocation
    | RerollShopTransitionInvocation
    | ExitShopTransitionInvocation;

export const ShopTransitions = {
    BuyScoreCardEntry: BuyScoreCardEntryTransition,
    BuyItem: BuyItemTransition,
    RerollShop: RerollShopTransition,
    ExitShop: ExitShopTransition,
};
