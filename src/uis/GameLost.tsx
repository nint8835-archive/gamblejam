import { useStore } from '../state/state';

export function GameLostUi() {
    const { invoke } = useStore();
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <h1 className="bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-6xl font-black leading-normal text-transparent">
                Lose
            </h1>
            <button
                className="rounded-md bg-gradient-to-b from-red-500 to-red-700 px-8 py-2 text-2xl font-semibold hover:from-red-700 hover:to-red-900"
                onClick={() => {
                    invoke({ type: 'QuitGame' });
                }}
            >
                Quit
            </button>
        </div>
    );
}
