import { WritableDraft } from 'immer';
import type { CompleteState } from '../state/types';

export type ItemId = 'Rerolls';

export type Item = {
    id: ItemId;
    name: string;
    description: string;
    shopCost: number;
    effect: (state: WritableDraft<CompleteState>) => void;
};

export const Items: Record<ItemId, Item> = {
    Rerolls: {
        id: 'Rerolls',
        name: 'Rerolls',
        description: 'Gain an extra reroll',
        shopCost: 3,
        effect: (state) => {
            state.rerolls++;
        },
    },
};
