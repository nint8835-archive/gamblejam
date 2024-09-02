import { type ScoreCardEntryId } from '../definitions/scorecard';

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
};

export type ActiveGameState = {
    stage: 'ActiveGame';
    currentGame: Game;
};

export type StateMachine = MainMenuState | ActiveGameState;

export type Stage = StateMachine['stage'];

export type GlobalStateValues = {};

export type State = {
    stateMachine: StateMachine;
};

export type Actions = {
    beginGame: () => void;

    rollDice: () => void;
    sortDice: () => void;
    toggleDice: (index: number) => void;
    unselectDice: () => void;
    resetRerolls: () => void;

    updateScoreCardValue: (index: number, value: number) => void;
};

export type StagedState<T extends StateMachine> = State & Actions & { stateMachine: T };
