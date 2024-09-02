import { useStore } from '../state/state';
import type { GameLostState, StagedState } from '../state/types';

export function GameLostUi() {
    const {
        reset,
        stateMachine: { targetScore, totalScore },
    } = useStore() as StagedState<GameLostState>;
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-8">
            <h1 className="bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-6xl font-black leading-normal text-transparent">
                You Lose
            </h1>

            <div className="grid grid-cols-2 rounded-md border-2 border-zinc-600">
                <div className="border-b-2 border-r-2 border-zinc-600 bg-zinc-800 p-2 text-xl font-semibold">
                    Required score
                </div>
                <div className="flex items-center justify-end border-b-2 border-zinc-600 p-2 text-lg font-medium">
                    {targetScore}
                </div>
                <div className="border-r-2 border-zinc-600 bg-zinc-800 p-2 text-xl font-semibold">Your score</div>
                <div className="flex items-center justify-end p-2 text-lg font-medium">{totalScore}</div>
            </div>

            <button
                className="rounded-md bg-gradient-to-b from-red-500 to-red-700 px-8 py-2 text-2xl font-semibold hover:from-red-700 hover:to-red-900"
                onClick={reset}
            >
                Quit
            </button>
        </div>
    );
}
