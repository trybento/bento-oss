import React, { useCallback, useMemo, useRef } from 'react';
import { WebComponentProps } from './components/CommonComponentProviders';
import {
  StepAutoCompleteInteraction,
  StepAutoCompleteInteractionEntityId,
} from 'bento-common/types/globalShoyuState';
import useElementsInjector, {
  ElementInjectorCallback,
  ElementInjectorData,
  ElementRemovalCallback,
} from 'bento-common/hooks/useElementInjector';
import composeComponent from 'bento-common/hocs/composeComponent';
import withLocation, {
  WithLocationPassedProps,
} from 'bento-common/hocs/withLocation';
import {
  stepAutoCompleteInteractionsByPageUrlSelector,
  stepSelector,
} from './stores/mainStore/helpers/selectors';
import withMainStoreData from './stores/mainStore/withMainStore';
import { MainStoreState } from './stores/mainStore/types';
import getFeatureFlags from './lib/featureFlags';

type OuterProps = WebComponentProps;

type Props = OuterProps & WithLocationPassedProps;

type MainStoreData = {
  autoCompleteInteractions: StepAutoCompleteInteraction[];
  dispatch: MainStoreState['dispatch'];
};

type InteractionData = {
  entityId: StepAutoCompleteInteractionEntityId;
  onDocumentClick: (target: HTMLElement) => (event: MouseEvent) => void;
};

const BentoAutoCompleteInteractions: React.FC<Props & MainStoreData> = ({
  uipreviewid,
  appLocation,
  autoCompleteInteractions,
  dispatch,
}) => {
  const { observeStylingAttributes } = getFeatureFlags(undefined);

  /**
   * Keeps track of event listeners created for each auto-complete interaction.
   * This is necessary to properly remove the event listener in case the target element goes missing.
   *
   * NOTE: This is a ref because we can't have the injection callbacks changing all the time, otherwise
   * they will keep triggering injection side effects that will cause an infinite loop.
   */
  const listenersMapRef = useRef<
    Record<
      StepAutoCompleteInteractionEntityId,
      ReturnType<InteractionData['onDocumentClick']>
    >
  >({});

  const autoCompleteElementsData = useMemo<
    ElementInjectorData<InteractionData>[]
  >(
    () =>
      autoCompleteInteractions.map((interaction) => ({
        url: interaction.wildcardUrl,
        selector: interaction.elementSelector,
        data: {
          entityId: interaction.entityId,
          onDocumentClick: (target: HTMLElement) => (event: MouseEvent) => {
            /**
             * If the target element does not match the event target element, then
             * it means this event isn't for us, therefore we end here.
             *
             * This is necessary because we're intentionally attaching the click event
             * to the document instead of the target element as an attempt to "prioritize"
             * the execution of this event listener.
             */
            if (event.target !== target) return;

            dispatch({
              type: 'stepAutoCompleteInteractionTriggered',
              interactionEntityId: interaction.entityId,
              currentPageUrl: appLocation.href,
            });
          },
        },
        isPreview: !!(uipreviewid && interaction.isPreview),
      })),
    [autoCompleteInteractions, uipreviewid]
  );

  /**
   * Adds an event listener to the document for each auto-complete interaction on button click
   * that matches an element on the page.
   *
   * This is intentionally added to the document to "prioritize" the execution of this event listener,
   * vs. if the event listener was added the target element.
   */
  const addInteraction = useCallback<ElementInjectorCallback<InteractionData>>(
    (target, { entityId, onDocumentClick }) => {
      if (target) {
        const newListener = onDocumentClick(target);
        // Set a reference to the event listener so we can remove it later
        listenersMapRef.current[entityId] = newListener;
        document.addEventListener('click', newListener, true);
      }
      return target;
    },
    []
  );

  /**
   * Removes the event listener from the document when the target element
   * is not anymore found on the page.
   */
  const deleteInteraction: ElementRemovalCallback<InteractionData> =
    useCallback<ElementRemovalCallback<InteractionData>>(
      (_target, { entityId }) => {
        const listener = listenersMapRef.current[entityId];
        if (listener) {
          document.removeEventListener('click', listener, true);
          // Unset reference to the event listener we just removed
          delete listenersMapRef.current[entityId];
        }
      },
      []
    );

  useElementsInjector(
    autoCompleteElementsData,
    addInteraction,
    deleteInteraction,
    undefined,
    observeStylingAttributes
  );

  return null;
};

export default composeComponent<OuterProps>([
  withLocation,
  withMainStoreData<Props, MainStoreData>(
    (state, { appLocation, uipreviewid }) => {
      return {
        autoCompleteInteractions: stepAutoCompleteInteractionsByPageUrlSelector(
          appLocation.href,
          state
        ).reduce<StepAutoCompleteInteraction[]>((acc, interaction) => {
          const step = stepSelector(interaction.step, state);

          if ((uipreviewid && !!interaction?.isPreview) || step) {
            acc.push(interaction);
          }

          return acc;
        }, []),
        dispatch: state.dispatch,
      };
    }
  ),
])(BentoAutoCompleteInteractions);
