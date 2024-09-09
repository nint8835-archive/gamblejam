import { FunctionComponent, useEffect } from 'react';
import { useStore } from './state/state';
import type { Stage } from './state/types';
import { ActiveGameUi } from './uis/ActiveGame';
import { GameLostUi } from './uis/GameLost';
import { GameWonUi } from './uis/GameWon';
import { LoadoutSelectUi } from './uis/LoadoutSelect';
import { MainMenuUi } from './uis/MainMenu';
import { ShopUi } from './uis/Shop';

const stageComponents: Record<Stage, FunctionComponent> = {
    MainMenu: MainMenuUi,
    LoadoutSelect: LoadoutSelectUi,
    ActiveGame: ActiveGameUi,
    GameLost: GameLostUi,
    GameWon: GameWonUi,
    Shop: ShopUi,
};

function App() {
    const stage = useStore((state) => state.stateMachine.stage);
    const toggleDevMode = useStore((state) => state.toggleDevMode);
    const UiComponent = stageComponents[stage];

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === '.') {
                toggleDevMode();
            }
        }

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    return <UiComponent />;
}

export default App;
