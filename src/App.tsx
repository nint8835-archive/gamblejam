import { FunctionComponent } from 'react';
import { useStore } from './state/state';
import type { Stage } from './state/types';
import { ActiveGameUi } from './uis/ActiveGame';
import { MainMenuUi } from './uis/MainMenu';

const stageComponents: Record<Stage, FunctionComponent> = {
    MainMenu: MainMenuUi,
    ActiveGame: ActiveGameUi,
};

function App() {
    const stage = useStore((state) => state.stateMachine.stage);
    const UiComponent = stageComponents[stage];

    return <UiComponent />;
}

export default App;
