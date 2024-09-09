import { ScoreCardEntryId } from './scorecard';

export type LoadoutId = 'Newbie' | 'OneMoreRoll' | 'LeaveItToFate';

export type Loadout = {
    name: string;
    description: string;
    dice: number;
    rerolls: number;
    scoreCardEntries: Partial<Record<ScoreCardEntryId, number>>;
};

export const Loadouts: Record<LoadoutId, Loadout> = {
    Newbie: {
        name: 'The Newbie',
        description:
            "You stumble into the casino with a travel Yahtzee set in your pocket, with no idea what you're in for.",
        dice: 5,
        rerolls: 3,
        scoreCardEntries: {
            Aces: 1,
            Twos: 1,
            Threes: 1,
            Fours: 1,
            Fives: 1,
            Sixes: 1,
            Chance: 1,
            ThreeOfAKind: 1,
            FourOfAKind: 1,
            FullHouse: 1,
            SmallStraight: 1,
            LargeStraight: 1,
            Yahtzee: 1,
        },
    },

    OneMoreRoll: {
        name: 'One More Roll...',
        description:
            'The regulars sigh as they see you coming. You can never resist just one more roll in the hopes of the perfect score.',
        dice: 5,
        rerolls: 10,
        scoreCardEntries: {
            Yahtzee: 10,
        },
    },

    LeaveItToFate: {
        name: 'Leave it to Fate',
        description:
            "You've always believed in fate taking you where it may. But in the casino, it doesn't help to take a few precautions.",
        dice: 10,
        rerolls: 0,
        scoreCardEntries: {
            Chance: 10,
        },
    },
};
