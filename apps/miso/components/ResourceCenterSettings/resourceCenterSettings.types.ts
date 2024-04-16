import { CommonTargeting } from 'bento-common/types/targeting';
import { FormattedRules } from 'components/EditorCommon/types';
import { ResourceCenterQuery$data } from 'relay-types/ResourceCenterQuery.graphql';
import { ResourceCenterSettingsQuery$data } from 'relay-types/ResourceCenterSettingsQuery.graphql';

type ResourceCenterValues = Omit<
  ResourceCenterSettingsQuery$data['uiSettings'],
  'helpCenter'
> & {
  helpCenter: Omit<
    ResourceCenterSettingsQuery$data['uiSettings']['helpCenter'],
    'targeting'
  > & {
    targeting: CommonTargeting<FormattedRules>;
  };
};

export type ResourceCenterFormValues = ResourceCenterQuery$data &
  ResourceCenterValues;
