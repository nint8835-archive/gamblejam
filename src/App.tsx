import { FunctionComponent } from 'react';
import { Stage, useStore } from './state';
import { ActiveGameUi } from './uis/ActiveGame';
import { MainMenuUi } from './uis/MainMenu';

const stageComponents: Record<Stage, FunctionComponent> = {
    MainMenu: MainMenuUi,
    ActiveGame: ActiveGameUi,
};

function App() {
    const stage = useStore((state) => state.stage);
    const UiComponent = stageComponents[stage];

    return <UiComponent />;
}

export default App;
