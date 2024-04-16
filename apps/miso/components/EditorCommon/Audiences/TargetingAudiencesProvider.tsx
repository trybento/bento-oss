import React, { createContext, useCallback, useContext, useMemo } from 'react';
import isEqual from 'lodash/isEqual';
import { useBoolean } from '@chakra-ui/react';

import { GroupTargeting } from 'bento-common/types/targeting';
import { useQueryAsHook } from 'hooks/useQueryAsHook';
import AudiencesQuery from 'queries/AudiencesQuery';
import { Audiences } from 'hooks/useSelectedAudience';
import AudienceModal from 'components/Templates/Tabs/AudienceModal';
import { isAllTargeting } from 'components/Templates/Tabs/templateTabs.helpers';

interface TargetingAudienceContextValue {
  audiences: Audiences;
  /**
   * If the current targeting matches one defined as an audience, it is "selected"
   * @deprecated Left in to show for v1.0 users, but not relevant to v2.0
   */
  selectedAudience: Audiences[number] | null;
  /**
   * Disallow saving a new audience because of a constraint, like duplicate sets or
   * all/all type targeting rules
   */
  disableSaveNew: boolean;
  /**
   * A string used for tooltips explaining why saving is disabled
   */
  disableReason?: string;
  /**
   * Opens the create audience modal
   */
  requestSaveAudience: () => void;
  nameExists: (newName: string, audienceEntityId?: string) => boolean;
  /** Allows children to refresh data */
  refetch: () => void;
}

const TargetingAudienceContext = createContext<TargetingAudienceContextValue>({
  audiences: [],
  selectedAudience: null,
  disableSaveNew: false,
  requestSaveAudience: () => {},
  nameExists: (_name, _id) => false,
  refetch: () => {},
});

export function useTargetingAudiencesContext() {
  return useContext(TargetingAudienceContext);
}

type AudienceProviderProps = {
  /** Current entity's targeting. If not provided, save is disabled and we assume a read state. */
  targeting?: GroupTargeting;
  /** Top level disable */
  savingDisabled?: boolean;
  /** Callback after we committed changes */
  onSaveComplete?: (audienceEntityId: string) => void | Promise<void>;
};

export default function TargetingAudienceProvider({
  targeting,
  savingDisabled,
  onSaveComplete,
  children,
}: React.PropsWithChildren<AudienceProviderProps>) {
  const [saveModalOpen, setSaveModalOpen] = useBoolean(false);
  const { data, refetch, loading } = useQueryAsHook(AudiencesQuery, {});
  const { refetch: containerRefetch } = useTargetingAudiencesContext();

  const audiences = (data?.audiences ?? []) as Audiences;

  const selectedAudience: Audiences[number] | null = useMemo(() => {
    const match = audiences.find((a) => isEqual(a.targets, targeting));

    return match ?? null;
  }, [audiences, targeting]);

  const onAudienceSaved = useCallback(
    (entityId: string) => {
      setSaveModalOpen.off();
      onSaveComplete?.(entityId);
      void refetch();
      /** If for example we have a nested form,
       *   the top provider above needs to know.
       * This means each provider layered over this has to fetch, so we will
       *   want to find a better solution like with a short cache TTL
       */
      containerRefetch?.();
    },
    [onSaveComplete]
  );

  const disableSaveNew = useMemo(
    () =>
      loading ||
      savingDisabled ||
      !targeting ||
      isAllTargeting(targeting) ||
      (selectedAudience && isEqual(selectedAudience.targets, targeting)),
    [loading, targeting, selectedAudience, savingDisabled]
  );

  const disableReason = useMemo(() => {
    return !targeting || isAllTargeting(targeting)
      ? 'All accounts and users can’t be saved as an audience'
      : selectedAudience
      ? 'Already saved as an audience'
      : undefined;
  }, [targeting, selectedAudience]);

  const nameExists = useCallback(
    (newName: string, auEntityId?: string) =>
      audiences.some(
        (a) =>
          a.name.trim().toLowerCase() === newName.trim().toLowerCase() &&
          a.entityId !== auEntityId
      ),
    [audiences]
  );

  return (
    <TargetingAudienceContext.Provider
      value={{
        refetch,
        audiences,
        selectedAudience,
        disableSaveNew,
        requestSaveAudience: setSaveModalOpen.on,
        disableReason,
        nameExists,
      }}
    >
      {children}
      <AudienceModal
        isOpen={saveModalOpen}
        onClose={setSaveModalOpen.off}
        onSave={onAudienceSaved}
        targets={targeting}
      />
    </TargetingAudienceContext.Provider>
  );
}
