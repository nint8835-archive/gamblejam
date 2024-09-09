import { type LoadoutId, Loadouts } from '../definitions/loadouts';
import { ScoreCardEntries, ScoreCardEntryId } from '../definitions/scorecard';
import { useStore } from '../state/state';

function LoadoutOption({ id }: { id: LoadoutId }) {
    const invoke = useStore((state) => state.invoke);

    const { name, description, dice, rerolls, scoreCardEntries } = Loadouts[id];
    return (
        <div
            className="cursor-pointer rounded-md border-2 border-zinc-500 p-4 transition-colors hover:bg-blue-950"
            onClick={() => invoke({ type: 'SelectLoadout', loadout: id })}
        >
            <h2 className="text-xl font-bold">{name}</h2>
            <div className="italic text-zinc-400">{description}</div>
            <div className="mt-2 flex flex-row justify-between">
                <div>
                    <span className="font-semibold">Dice:</span>{' '}
                    <span className="font-light text-zinc-200">{dice}</span>
                </div>
                <div>
                    <span className="font-semibold">Rerolls:</span>{' '}
                    <span className="font-light text-zinc-200">{rerolls}</span>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
                {(Object.entries(scoreCardEntries) as [ScoreCardEntryId, number][]).map(([entryId, count]) => (
                    <div key={entryId} className="flex flex-row justify-between">
                        <div className="font-semibold">{ScoreCardEntries[entryId].name}</div>
                        <div className="font-light text-zinc-200">x{count}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function LoadoutSelectUi() {
    return (
        <div>
            <div className="flex w-full place-content-center">
                <h1 className="w-fit bg-gradient-to-br from-red-500 to-amber-500 bg-clip-text p-4 text-center text-4xl font-bold text-transparent">
                    Select Loadout
                </h1>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.keys(Loadouts).map((id) => (
                    <LoadoutOption key={id} id={id as LoadoutId} />
                ))}
            </div>
        </div>
    );
}
