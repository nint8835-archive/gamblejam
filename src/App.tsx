import { FunctionComponent } from 'react';
import { useStore } from './state/state';
import type { Stage } from './state/types';
import { ActiveGameUi } from './uis/ActiveGame';
import { GameLostUi } from './uis/GameLost';
import { GameWonUi } from './uis/GameWon';
import { MainMenuUi } from './uis/MainMenu';

const stageComponents: Record<Stage, FunctionComponent> = {
    MainMenu: MainMenuUi,
    ActiveGame: ActiveGameUi,
    GameLost: GameLostUi,
    GameWon: GameWonUi,
};

function App() {
    const stage = useStore((state) => state.stateMachine.stage);
    const UiComponent = stageComponents[stage];

    return <UiComponent />;
}

export default App;
