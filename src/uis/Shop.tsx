import { ScoreCardEntries, ScoreCardEntryId } from '../definitions/scorecard';
import { useStore } from '../state/state';
import { ShopState, StagedState } from '../state/types';
import { cn } from '../util';

function ScoreCardEntryShopItem({ entry, index }: { entry: ScoreCardEntryId; index: number }) {
    const { invoke, scoreCardContents, money } = useStore() as StagedState<ShopState>;

    const entryDetails = ScoreCardEntries[entry];
    const ownedCount = scoreCardContents.filter((id) => id === entry).length;

    return (
        <div
            className={cn(
                'flex w-full cursor-pointer flex-row items-center justify-between rounded-md border-2 border-zinc-900 bg-zinc-700 p-2 transition-colors',
                money >= entryDetails.shopCost && 'hover:bg-zinc-900',
                money < entryDetails.shopCost && 'cursor-not-allowed opacity-50',
            )}
            onClick={() => invoke({ type: 'BuyScoreCardEntry', index })}
        >
            <div>
                <div className="text-xl font-bold">{entryDetails.name}</div>
                <div className="italic text-zinc-400">{entryDetails.description}</div>
                <div className="mt-4 text-xs text-zinc-400">{`You own ${ownedCount}`}</div>
            </div>
            <div className="text-lg font-semibold">{entryDetails.shopCost}</div>
        </div>
    );
}

export function ShopUi() {
    const {
        money,
        stateMachine: { availableScoreCardEntries },
        invoke,
    } = useStore() as StagedState<ShopState>;

    return (
        <div className="p-4">
            <div className="grid grid-cols-3">
                <div className="flex w-full items-center justify-start text-2xl font-semibold text-green-500">{`$${money}`}</div>
                <div className="flex w-full items-center justify-center">
                    <h1 className="w-fit bg-gradient-to-br from-green-300 via-blue-500 to-purple-600 bg-clip-text text-4xl font-black leading-normal text-transparent">
                        Shop
                    </h1>
                </div>
                <div className="flex w-full items-center justify-end">
                    <button
                        className="text-md rounded-md bg-gradient-to-b from-green-500 to-green-700 px-4 py-2 font-medium hover:from-green-700 hover:to-green-900"
                        onClick={() => invoke({ type: 'ExitShop' })}
                    >
                        Continue
                    </button>
                </div>
            </div>
            <div className="mt-2 grid grid-rows-1">
                <div className="space-y-2 rounded-md bg-zinc-800 p-2">
                    <h2 className="flex justify-center text-2xl font-semibold text-rose-500">Score Card Entries</h2>
                    <div className="flex flex-row justify-between gap-4">
                        {availableScoreCardEntries.map((entry, index) => (
                            <ScoreCardEntryShopItem entry={entry} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
