import create, { GetState, Mutate, SetState, StoreApi } from 'zustand/vanilla';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import produce from 'immer';

import { GlobalSidebarState, SidebarStoreState } from './types';
import sidebarToggled from './actions/sidebarToggled';
import sidebarStateCreated from './actions/sidebarStateCreated';
import transitionsToggled from './actions/transitionsToggled';
import sidebarStateRemoved from './actions/sidebarStateRemoved';
import sidebarAutoOpenToggled from './actions/sidebarAutoOpenToggled';
import { isDevtoolsEnabled } from '../../lib/debug';
import errorBoundary from '../middleware/errorBoundary';

export const initialState: GlobalSidebarState = {
  isInlineEmbedPresent: false,
  sidebars: {
    main: {
      open: false,
      isPreview: false,
      transitionBetweenViews: false,
      shouldAutoOpen: false,
      toggledOffAtLeastOnce: false,
    },
  },
  hiddenViaZendesk: false,
  initialized: undefined,
};

const sidebarStore = create<
  SidebarStoreState,
  SetState<SidebarStoreState>,
  GetState<SidebarStoreState>,
  Mutate<
    StoreApi<SidebarStoreState>,
    [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]]
  >
>(
  // @ts-ignore-error
  errorBoundary(
    (isDevtoolsEnabled() ? devtools : (a: any) => a)(
      subscribeWithSelector((set) => ({
        ...initialState,
        toggleSidebar: (
          ...args: Parameters<SidebarStoreState['toggleSidebar']>
        ) =>
          set(
            produce<SidebarStoreState>((state) =>
              sidebarToggled(state, ...args)
            ),
            false,
            // @ts-ignore
            { type: 'toggleSidebar', args }
          ),
        createSidebarState: (id, isPreview) =>
          set(
            produce<SidebarStoreState>((state) =>
              sidebarStateCreated(state, id, isPreview)
            ),
            false,
            // @ts-ignore
            { type: 'createSidebarState', id }
          ),
        removeSidebarState: (id) =>
          set(
            produce<SidebarStoreState>((state) =>
              sidebarStateRemoved(state, id)
            ),
            false,
            // @ts-ignore
            { type: 'removeSidebarState', id }
          ),
        disableTransitions: (id) =>
          set(
            produce<SidebarStoreState>((state) =>
              transitionsToggled(state, id, false)
            ),
            false,
            // @ts-ignore
            { type: 'disableTransitions', id }
          ),
        enableTransitions: (id) =>
          set(
            produce<SidebarStoreState>((state) =>
              transitionsToggled(state, id, true)
            ),
            false,
            // @ts-ignore
            { type: 'enableTransitions', id }
          ),
        toggleSidebarAutoOpen: (id, autoOpen) =>
          set(
            produce<SidebarStoreState>((state) =>
              sidebarAutoOpenToggled(state, id, autoOpen)
            ),
            false,
            // @ts-ignore
            { type: 'toggleSidebarAutoOpen', id, autoOpen }
          ),
        setInlineEmbedPresent: (present: boolean) =>
          set(
            produce<SidebarStoreState>((state) => {
              state.isInlineEmbedPresent = present;
            }),
            false,
            // @ts-ignore
            { type: 'setInlineEmbedPresent', present }
          ),
        setHiddenViaZendesk: (value) =>
          set(
            produce<SidebarStoreState>((state) => {
              state.hiddenViaZendesk = value;
            }),
            false,
            // @ts-ignore
            { type: 'setHiddenViaZendesk', value }
          ),
      })),
      // @ts-ignore-error
      {
        name: `Bento Sidebar Store - ${window.location.host} - ${document.title}`,
      }
    ),
    'sidebarStore'
  )
);

export default sidebarStore;
