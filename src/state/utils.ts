import { ScoreCardEntries, type ScoreCardEntryId } from '../definitions/scorecard';
import type { ActiveGameState } from './types';

export function scoreEntry(stateMachine: ActiveGameState, entry: ScoreCardEntryId): number {
    const { selectedDice, dice } = stateMachine.currentGame;

    if (selectedDice.length !== 5) {
        return 0;
    }

    const selectedDiceValues = selectedDice.map((index) => dice[index]);

    return ScoreCardEntries[entry].scoreFunc(selectedDiceValues);
}
