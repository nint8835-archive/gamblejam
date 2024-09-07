import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { ScoreCardEntries, type ScoreCardEntryId } from '../definitions/scorecard';
import { invokeTransition, TransitionInvocation } from './transitions/all';
import type { CompleteState, State } from './types';

const initialState: State = {
    stateMachine: {
        stage: 'MainMenu',
    },

    devMode: false,

    scoreCardContents: Object.keys(ScoreCardEntries) as ScoreCardEntryId[],
    money: 5,
    rerolls: 3,
};

export const useStore = create<CompleteState>()(
    devtools(
        immer((set) => ({
            ...initialState,

            invoke: (invocation: TransitionInvocation) => {
                set(
                    (state) => {
                        invokeTransition(state, invocation);
                    },
                    undefined,
                    invocation.type,
                );
            },

            reset: () => set(() => initialState, undefined, 'reset'),

            toggleDevMode: () =>
                set(
                    (state) => {
                        state.devMode = !state.devMode;
                    },
                    undefined,
                    'toggleDevMode',
                ),
        })),
    ),
);
