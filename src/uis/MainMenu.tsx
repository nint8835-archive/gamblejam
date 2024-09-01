import { useStore } from '../state';

export function MainMenuUi() {
    const beginGame = useStore((state) => state.beginGame);

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <h1 className="bg-gradient-to-br from-red-500 to-purple-500 bg-clip-text text-6xl font-black text-transparent">
                Gamblejam
            </h1>
            <button
                className="rounded-md bg-gradient-to-b from-green-500 to-green-700 px-8 py-2 text-2xl font-semibold hover:from-green-700 hover:to-green-900"
                onClick={beginGame}
            >
                Start
            </button>
        </div>
    );
}
