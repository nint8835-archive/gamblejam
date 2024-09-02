import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { invokeTransition, TransitionInvocation } from './transitions/all';
import type { CompleteState } from './types';

export const useStore = create<CompleteState>()(
    devtools(
        immer((set) => ({
            stateMachine: {
                stage: 'MainMenu',
            },

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
