import React, { createContext, useContext, useMemo } from 'react';
import {
  FormFactorStyle,
  GuideDesignType,
  GuideFormFactor,
  GuidePageTargetingType,
  GuideBaseState,
  SplitTestState,
  Theme,
} from 'bento-common/types';
import { isGuideStateActive } from 'bento-common/data/helpers';

export type GuideTypeEnumType = 'account' | 'user' | 'template';

// TODO: Add typings
export interface GuideBase {
  entityId: string;
  type?: GuideTypeEnumType;
  theme?: Theme;
  name?: string;
  isTargetedForSplitTesting?: SplitTestState;
  formFactorStyle?: FormFactorStyle;
  isSideQuest?: boolean;
  pageTargetingType?: GuidePageTargetingType;
  formFactor?: GuideFormFactor;
  designType?: GuideDesignType;
  state?: GuideBaseState;
  participantsCount?: number;
  participantsWhoViewedCount?: number;
  guideModuleBases?: any;
  wasAutoLaunched?: boolean;
  isModifiedFromTemplate?: boolean;
  createdFromTemplate?: {
    name?: string;
    entityId?: string;
  };
}

interface PersistedGuideBaseProviderValue {
  guideBase: GuideBase;
  isActive: boolean;
  guideType: GuideTypeEnumType;
  isTargetedForSplitTesting: SplitTestState;
  participantsCount: number;
  participantsByGuideModuleBaseEntityId: object;
  participantsWhoViewedCount: number;
  participantsWhoViewedByGuideModuleBaseEntityId: object;
}

interface PersistedGuideBaseProviderProps {
  children: any;
  guideBase: GuideBase;
}

const PersistedGuideBaseContext =
  createContext<PersistedGuideBaseProviderValue>({
    guideBase: { entityId: '' },
    isActive: false,
    isTargetedForSplitTesting: SplitTestState.none,
    guideType: null,
    participantsCount: 0,
    participantsByGuideModuleBaseEntityId: {},
    participantsWhoViewedCount: 0,
    participantsWhoViewedByGuideModuleBaseEntityId: {},
  });

export function usePersistedGuideBase() {
  const {
    guideBase,
    isActive,
    isTargetedForSplitTesting,
    guideType,
    participantsCount,
    participantsByGuideModuleBaseEntityId,
    participantsWhoViewedCount,
    participantsWhoViewedByGuideModuleBaseEntityId,
  } = useContext(PersistedGuideBaseContext);

  return {
    guideBase,
    isActive,
    isTargetedForSplitTesting,
    guideType,
    participantsCount,
    participantsByGuideModuleBaseEntityId,
    participantsWhoViewedCount,
    participantsWhoViewedByGuideModuleBaseEntityId,
  };
}

export default function PersistedGuideBaseProvider({
  children,
  guideBase,
}: PersistedGuideBaseProviderProps) {
  const participantsWhoViewedByGuideModuleBaseEntityId = {};

  useMemo(() => {
    guideBase?.guideModuleBases.map((guideModuleBase) => {
      participantsWhoViewedByGuideModuleBaseEntityId[guideModuleBase.entityId] =
        [];

      const trackedUsers = new Set<string>();

      // TODO: Combine logic with EditUserGuideBase/index
      guideModuleBase.guideStepBases?.forEach((gsb) => {
        gsb.usersViewed?.forEach((uv) => {
          if (trackedUsers.has(uv.email)) return;

          participantsWhoViewedByGuideModuleBaseEntityId[
            guideModuleBase.entityId
          ].push(uv);
          trackedUsers.add(uv.email);
        });
      });
    });
  }, [guideBase?.guideModuleBases]);

  if (!guideBase) return null;

  const participantsCount = guideBase.participantsCount;

  const participantsByGuideModuleBaseEntityId = {};
  guideBase.guideModuleBases.map((guideModuleBase) => {
    participantsByGuideModuleBaseEntityId[guideModuleBase.entityId] = (
      guideModuleBase.participants || []
    ).map((participant) => participant);
  });

  const participantsWhoViewedCount = guideBase.participantsWhoViewedCount;

  return (
    <PersistedGuideBaseContext.Provider
      value={{
        guideBase,
        isActive: isGuideStateActive(guideBase.state),
        isTargetedForSplitTesting: guideBase.isTargetedForSplitTesting,
        guideType: guideBase.type,
        participantsCount,
        participantsByGuideModuleBaseEntityId,
        participantsWhoViewedCount,
        participantsWhoViewedByGuideModuleBaseEntityId,
      }}
    >
      {children}
    </PersistedGuideBaseContext.Provider>
  );
}
