import { type WritableDraft } from 'immer';
import { type ItemId } from '../definitions/items';
import { type ScoreCardEntryId } from '../definitions/scorecard';
import { type TransitionInvocation } from './transitions/all';

export type MainMenuState = {
    stage: 'MainMenu';
};

export type ScoreCardValue = {
    entryId: ScoreCardEntryId;
    value: number | null;
};

export type Game = {
    dice: number[];
    selectedDice: number[];
    rerolls: number;

    scoreCardValues: ScoreCardValue[];
    totalScore: number;
    targetScore: number;
};

export type ActiveGameState = {
    stage: 'ActiveGame';
    currentGame: Game;
};

export type GameLostState = {
    stage: 'GameLost';
    totalScore: number;
    targetScore: number;
};

export type GameWonState = {
    stage: 'GameWon';
    unusedCardEarnings: number;
    totalEarnings: number;
};

export type ShopState = {
    stage: 'Shop';
    rerollCost: number;

    availableScoreCardEntries: ScoreCardEntryId[];
    availableItems: ItemId[];
};

export type StateMachine = MainMenuState | ActiveGameState | GameLostState | GameWonState | ShopState;

export type Stage = StateMachine['stage'];

export type State = {
    stateMachine: StateMachine;

    devMode: boolean;

    scoreCardContents: ScoreCardEntryId[];
    dice: number;
    money: number;
    rerolls: number;
    completedGames: number;
};

export type Actions = {
    invoke: (invocation: TransitionInvocation) => void;
    reset: () => void;
    toggleDevMode: () => void;
};

export type CompleteState = State & Actions;

export type StagedState<T extends StateMachine> = CompleteState & { stateMachine: T };

export type Transition<T> = {
    permittedStates?: Stage[];
    invoke: (state: WritableDraft<CompleteState>, invocation: T) => void;
};
