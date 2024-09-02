import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { ScoreCardEntries, type ScoreCardEntryId } from '../definitions/scorecard';
import { invokeTransition, TransitionInvocation } from './transitions/all';
import type { CompleteState } from './types';

export const useStore = create<CompleteState>()(
    devtools(
        immer((set) => ({
            stateMachine: {
                stage: 'MainMenu',
            },

            scoreCardContents: Object.keys(ScoreCardEntries) as ScoreCardEntryId[],

            invoke: (invocation: TransitionInvocation) => {
                set(
                    (state) => {
                        invokeTransition(state, invocation);
                    },
                    undefined,
                    invocation.type,
                );
            },
        })),
    ),
);
