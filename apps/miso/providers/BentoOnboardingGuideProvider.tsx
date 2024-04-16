import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import { graphql } from 'react-relay';
import { differenceInDays } from 'date-fns';
import Bowser from 'bowser';
import { throttle } from 'lodash';

import { isAnnouncementGuide } from 'bento-common/utils/formFactor';
import {
  FeatureFlagNames,
  GuideDesignType,
  GuideFormFactor,
  TemplateState,
  InlineEmbedState,
} from 'bento-common/types';
import { isGuideStateActive } from 'bento-common/data/helpers';

import QueryRenderer from 'components/QueryRenderer';
import { useLoggedInUser } from 'providers/LoggedInUserProvider';
import { BentoOnboardingGuideProviderQuery } from 'relay-types/BentoOnboardingGuideProviderQuery.graphql';
import { BENTO_APP_ID } from 'utils/constants';
import useChromeExtensionInstalled from 'hooks/useChromeExtensionInstalled';

type OuterProps = {};
interface BentoOnboardingGuideProviderValue {
  hasNoActiveGuide: boolean;
  onboardingAttributes: OnboardingAttributes;
}

const BentoOnboardingGuideContext =
  createContext<BentoOnboardingGuideProviderValue>({
    hasNoActiveGuide: false,
    onboardingAttributes: null,
  });

export function useBentoOnboardingGuideProvider() {
  const { hasNoActiveGuide, onboardingAttributes } = useContext(
    BentoOnboardingGuideContext
  );

  return { hasNoActiveGuide, onboardingAttributes };
}

export type OnboardingAttributes =
  | null
  | ({
      successfulInitialization: string;
      integrations: string[];
      integrationsCount: number;
      embedLive: boolean;
      trialDaysLeft: number;
      activeGuides: number;
      announcementCount: number;
      contextualCount: number;
      onboardingCount: number;
    } & Omit<
      BentoOnboardingGuideProviderQuery['response']['organization'],
      | 'diagnostics'
      | 'users'
      | 'templates'
      | 'hasIntegrations'
      | 'inlineEmbeds'
      | 'trialEndedAt'
    >);

const BentoOnboardingGuideProvider: React.FC<
  React.PropsWithChildren<BentoOnboardingGuideProviderQuery['response']>
> = ({
  organization: {
    diagnostics,
    users,
    templates,
    hasIntegrations,
    inlineEmbeds,
    trialEndedAt,
    ...extraOrgData
  },
  uiSettings: { sidebarAvailability },
  children,
}) => {
  const [hasGuide, setHasGuide] = useState<boolean>();
  const [hasActiveGuide, setHasActiveGuide] = useState<boolean>();
  const { loggedInUser } = useLoggedInUser();
  const extension = useChromeExtensionInstalled();
  const browserName = useMemo(() => {
    const name = Bowser.getParser(window.navigator.userAgent).getBrowserName();
    if (name === '') return 'Unknown';
    return name;
  }, []);
  const { organization } = loggedInUser;
  const router = useRouter();
  const { redirectIfGuideComplete } = router.query;

  const onboardingAttributes = useMemo<OnboardingAttributes>(
    () => {
      if (!BENTO_APP_ID) return;

      const templateInfo = templates.reduce(
        (a, t) => {
          if (isAnnouncementGuide(t.formFactor as GuideFormFactor))
            a.announcementCount++;
          if (t.designType === GuideDesignType.everboarding)
            a.contextualCount++;
          if (t.designType === GuideDesignType.onboarding) a.onboardingCount++;
          if (isGuideStateActive(t.state as TemplateState)) a.activeGuides++;

          return a;
        },
        {
          activeGuides: 0,
          announcementCount: 0,
          contextualCount: 0,
          onboardingCount: 0,
        }
      );

      const now = new Date();
      const trialEndDate = trialEndedAt ? new Date(trialEndedAt) : null;
      const trialDaysLeft =
        trialEndedAt === null
          ? null
          : trialEndDate > now
          ? differenceInDays(trialEndDate, now)
          : 0;

      return {
        successfulInitialization: diagnostics?.successfulInitialization,
        integrations: hasIntegrations as string[],
        integrationsCount: hasIntegrations.length,
        embedLive: inlineEmbeds.some(
          (ie) => ie.state === InlineEmbedState.active
        ),
        enabledFeatureFlags: organization.enabledFeatureFlags as string[],
        isSidebarSuppressed: organization.enabledFeatureFlags.includes(
          FeatureFlagNames.hideSidebar
        ),
        sidebarVisibilitySetting: sidebarAvailability,
        trialDaysLeft,
        ...templateInfo,
        ...extraOrgData,
      };
    },
    /**
     * WARNING: We're intentionally not observing all deps, otherwise this could change too often
     * and indirectly trigger Bento to initialize multiple times in a short time span, which is
     * definitely not desirable.
     *
     * That being said, we need to guarantee that important data is always available at the beginning.
     */
    [loggedInUser, organization]
  );

  const initializeBento = throttle(
    () => {
      window.bentoSettings = {
        appId: BENTO_APP_ID,
        account: {
          id: organization.entityId,
          name: organization.name,
          createdAt: organization.createdAt as string,
          ...onboardingAttributes,
        },
        accountUser: {
          id: loggedInUser.entityId,
          fullName: loggedInUser.fullName,
          email: loggedInUser.email,
          createdAt: loggedInUser.createdAt as string,
          firstName: loggedInUser.fullName?.split(' ')[0] || '',
          hasChromeExtension: extension.installed,
          browserName,
        },
      };
      window.Bento?.initialize();
    },
    100,
    { leading: true }
  );

  useEffect(() => {
    if (extension.isLoading) return;
    initializeBento();
  }, [onboardingAttributes, extension.isLoading]);

  const handleNoActiveGuide = useCallback(() => {
    setHasGuide(false);
    setHasActiveGuide(false);
  }, []);

  const handleHasActiveGuide = useCallback((e) => {
    setHasGuide(true);
    setHasActiveGuide(!e?.detail?.isComplete);
  }, []);

  useEffect(() => {
    document.addEventListener('bento-onGuideLoad', handleHasActiveGuide);
    document.addEventListener('bento-noGuideFound', handleNoActiveGuide);
    return () => {
      document.removeEventListener('bento-onGuideLoad', handleHasActiveGuide);
      document.removeEventListener('bento-noGuideFound', handleNoActiveGuide);
    };
  }, [handleNoActiveGuide, handleHasActiveGuide]);

  useEffect(() => {
    if (router.route !== '/') return;
    if (
      (redirectIfGuideComplete === 'true' &&
        hasGuide &&
        hasActiveGuide === false) ||
      hasGuide === false
    ) {
      router.push('/library');
    }
  }, [redirectIfGuideComplete, hasGuide, hasActiveGuide, router.route]);

  useEffect(
    () => () => {
      // clean up
      window.bentoSettings = null;
      window.Bento.reset();
    },
    []
  );

  return (
    <BentoOnboardingGuideContext.Provider
      value={{ hasNoActiveGuide: hasActiveGuide, onboardingAttributes }}
    >
      {children}
    </BentoOnboardingGuideContext.Provider>
  );
};

const ONBOARDING_GUIDE_PROVIDER_QUERY = graphql`
  query BentoOnboardingGuideProviderQuery {
    organization {
      state
      plan
      hasLaunchedGuides
      hasAccountUsers
      templates {
        state
        formFactor
        isSideQuest
        designType
      }
      users {
        entityId
      }
      inlineEmbeds {
        state
      }
      trialEndedAt
      hasIntegrations
      diagnostics {
        successfulInitialization
      }
    }
    uiSettings {
      sidebarAvailability
    }
  }
`;

const BentoOnboardingGuideProviderQueryRenderer: React.FC<
  React.PropsWithChildren<OuterProps>
> = ({ children }) => (
  <QueryRenderer<BentoOnboardingGuideProviderQuery>
    query={ONBOARDING_GUIDE_PROVIDER_QUERY}
    fetchPolicy="network-only"
    render={({ props }) => {
      if (!props) return null;
      return (
        <BentoOnboardingGuideProvider {...props}>
          {children}
        </BentoOnboardingGuideProvider>
      );
    }}
  />
);
export default BentoOnboardingGuideProviderQueryRenderer;
