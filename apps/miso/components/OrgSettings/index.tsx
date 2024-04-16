import debounce from 'lodash/debounce';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { graphql, useSubscription } from 'react-relay';
import { Box, useToast } from '@chakra-ui/react';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { GraphQLSubscriptionConfig, OperationType } from 'relay-runtime';

import QueryRenderer from 'components/QueryRenderer';
import { OrgSettingsQuery } from 'relay-types/OrgSettingsQuery.graphql';
import NotificationsTabPanel from './NotificationsTabPanel';
import { TabPanelProps } from './types';
import UsersTabPanel from './UsersTabPanel';
import organizationChangedSubscription from 'subscriptions/OrganizationChanged';
import { OrganizationChangedSubscription } from 'relay-types/OrganizationChangedSubscription.graphql';
import * as SetOrgSettings from 'mutations/SetOrgSettings';
import Page from 'components/layout/Page';

type OrgSettingsSubscriptionWrapperProps = OrgSettingsQuery['response'] & {
  refetch: () => void;
};

type OrgSettingsInitialValues = OrgSettingsQuery['response']['orgSettings'] & {
  orgName: OrgSettingsQuery['response']['organization']['name'];
  inviteUsers?: string;
};

export type OrgSettingsProps = {
  initialValues: OrgSettingsInitialValues;
  organization: OrgSettingsQuery['response']['organization'];
  refetch: () => void;
};

enum OrganizationTabs {
  Notifications = 0,
  BlockedAccounts = 1,
  Users = 2,
  DetailsAndBilling = 3,
}

enum OrganizationTabNames {
  Notifications = 'notifications',
  BlockedAccounts = 'blocked-accounts',
  Users = 'users',
  DetailsAndBilling = 'details-and-billing',
}

/* For tabbing queries */
const pathname = '/settings/organization';
const queryName = 'tab';

function OrgSettings(props: OrgSettingsProps) {
  const { initialValues, organization, refetch } = props;
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const toast = useToast();
  const router = useRouter();

  const { query } = router;

  let initialTab: OrganizationTabs;
  if (query.tab) {
    if (query.tab === OrganizationTabNames.Notifications)
      initialTab = OrganizationTabs.Notifications;
    if (query.tab === OrganizationTabNames.Users)
      initialTab = OrganizationTabs.Users;
    if (query.tab === OrganizationTabNames.BlockedAccounts)
      initialTab = OrganizationTabs.BlockedAccounts;
    if (query.tab === OrganizationTabNames.DetailsAndBilling)
      initialTab = OrganizationTabs.DetailsAndBilling;
  }

  const [selectedTabIndex, setSelectedTabIndex] =
    React.useState<OrganizationTabs>(
      initialTab || OrganizationTabs.Notifications
    );

  const areFieldsValid = useCallback(
    (values: OrgSettingsProps['initialValues']): boolean => {
      if (
        values?.sendAccountUserNudges === true &&
        !values?.defaultUserNotificationURL
      ) {
        return false;
      }

      return true;
    },
    []
  );

  const onTabChange = useCallback(
    (tabIndex: number) => {
      let queryValue;

      switch (tabIndex) {
        case OrganizationTabs.Notifications:
          queryValue = OrganizationTabNames.Notifications;
          break;
        case OrganizationTabs.Users:
          queryValue = OrganizationTabNames.Users;
          break;
        case OrganizationTabs.DetailsAndBilling:
          queryValue = OrganizationTabNames.DetailsAndBilling;
          break;
        case OrganizationTabs.BlockedAccounts:
          queryValue = OrganizationTabNames.BlockedAccounts;
          break;
        default:
          break;
      }

      setSelectedTabIndex(tabIndex);

      router.replace(
        {
          pathname,
          query: {
            [queryName]: queryValue,
          },
        },
        `${pathname}?${queryName}=${queryValue}`,
        { shallow: true }
      );
    },
    [router]
  );

  const onSave = async (values: OrgSettingsProps['initialValues']) => {
    if (!areFieldsValid(values)) return;

    setIsSaving(true);
    try {
      const {
        sendEmailNotifications,
        sendAccountUserNudges,
        defaultUserNotificationURL,
        fallbackCommentsEmail,
        orgName,
      } = values;
      await SetOrgSettings.commit({
        orgName,
        sendAccountUserNudges,
        sendEmailNotifications,
        defaultUserNotificationURL,
        fallbackCommentsEmail,
      });

      toast({
        title: 'Saved!',
        isClosable: true,
        status: 'success',
      });
    } catch (e) {
      toast({
        title: 'There was a problem saving. Please try again.',
        isClosable: true,
        status: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const debounceSetFieldValue = useCallback(
    debounce(
      (setFieldValueFn: any, field: string, newValue: string | boolean) => {
        setFieldValueFn(field, newValue);
      },
      500
    ),
    []
  );

  return (
    <Box>
      <Box>
        <Formik
          initialValues={initialValues}
          onSubmit={onSave}
          enableReinitialize={true}
        >
          {({ values, dirty, setFieldValue, handleSubmit }) => {
            const areCurrentFieldsValid = areFieldsValid(values);

            const tabPanelProps: TabPanelProps = {
              debounceSetFieldValue,
              values,
              propValues: initialValues,
              setFieldValue,
              refetch,
            };

            return (
              <Page
                title="Organization settings"
                tabs={[
                  {
                    title: 'Notifications',
                    component: () => (
                      <NotificationsTabPanel
                        {...tabPanelProps}
                        blockSaving={isSaving}
                        areCurrentFieldsValid={areCurrentFieldsValid}
                      />
                    ),
                  },
                  {
                    title: 'Users',
                    component: () => <UsersTabPanel {...tabPanelProps} />,
                  },
                ]}
              />
            );
          }}
        </Formik>
      </Box>
    </Box>
  );
}

function OrgSettingsSubscriptionWrapper(
  props: React.PropsWithChildren<OrgSettingsSubscriptionWrapperProps>
) {
  const { organization: queryOrganization, orgSettings, ...restProps } = props;

  const [organization, setOrganization] =
    useState<OrgSettingsQuery['response']['organization']>(queryOrganization);

  useSubscription(
    useMemo<GraphQLSubscriptionConfig<OperationType>>(
      () => ({
        subscription: organizationChangedSubscription,
        variables: undefined,
        onNext: (data: OrganizationChangedSubscription['response']) =>
          setOrganization(data.organization),
      }),
      []
    )
  );

  useEffect(() => {
    if (queryOrganization) {
      setOrganization(queryOrganization);
    }
  }, [queryOrganization]);

  return (
    <OrgSettings
      initialValues={{ ...orgSettings, orgName: organization?.name }}
      organization={organization}
      {...restProps}
    />
  );
}

graphql`
  fragment OrgSettings_organization on Organization {
    entityId
    name
    state
    createdAt
    trialStartedAt
    trialEndedAt
    diagnostics {
      successfulInitialization
      hardCodedUsers
      validAccountUserIds
      hardCodedAccounts
      hasRecommendedAttributes
      inconsistentTypes
      nonIsoDates
    }
  }
`;

const ORG_SETTINGS_QUERY = graphql`
  query OrgSettingsQuery {
    organization {
      ...OrgSettings_organization @relay(mask: false)
    }
    orgSettings {
      defaultUserNotificationURL
      sendAccountUserNudges
      sendEmailNotifications
      fallbackCommentsEmail
    }
  }
`;

export default function OrgSettingsRenderer() {
  return (
    <QueryRenderer<OrgSettingsQuery>
      query={ORG_SETTINGS_QUERY}
      render={({ props, retry }) => {
        if (props) {
          return <OrgSettingsSubscriptionWrapper {...props} refetch={retry} />;
        }
      }}
    ></QueryRenderer>
  );
}
