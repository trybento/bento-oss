import { graphql } from 'react-relay';
import fetchQuery from 'queries/fetchQuery';
import { OrganizationUISettingsQuery } from 'relay-types/OrganizationUISettingsQuery.graphql';
import { FetchQueryFetchPolicy } from 'relay-runtime';
import { useCallback, useEffect, useState } from 'react';

interface Props {
  fetchPolicy?: FetchQueryFetchPolicy;
}

const commit = ({ fetchPolicy }: Props) => {
  return fetchQuery<
    OrganizationUISettingsQuery['variables'],
    OrganizationUISettingsQuery['response']
  >({
    query: graphql`
      query OrganizationUISettingsQuery {
        uiSettings {
          embedBackgroundHex
          primaryColorHex
          secondaryColorHex
          additionalColors {
            value
          }
          fontColorHex
          theme
          cyoaOptionBackgroundColor
          isCyoaOptionBackgroundColorDark
          cyoaTextColor
          borderColor
          tagPrimaryColor
          tagDotSize
          tagPulseLevel
          tagBadgeIconBorderRadius
          tagTextColor
          tagBadgeIconPadding
          tagCustomIconUrl
          tagVisibility
        }
      }
    `,
    variables: {},
    options: {
      fetchPolicy,
    },
    doNotRetain: true,
  });
};

export const useUISettings = (
  fetchPolicy?: FetchQueryFetchPolicy
): OrganizationUISettingsQuery['response']['uiSettings'] | null => {
  const [uiSettings, setUiSettings] =
    useState<OrganizationUISettingsQuery['response']['uiSettings']>(null);

  const loadUiSettings = useCallback(
    async () => setUiSettings((await commit({ fetchPolicy })).uiSettings),
    []
  );

  useEffect(() => {
    loadUiSettings();
  }, []);

  return uiSettings;
};

export default commit;
