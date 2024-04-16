import React from 'react';
import { $enum } from 'ts-enum-util';

import {
  GuideComponentFilter,
  GuideStatusFilter,
  ScopeFilter,
  TableFilters,
  TemplateFilter,
} from 'bento-common/types/filters';
import RuleAttributeValuesQuery from 'queries/RuleAttributeValuesQuery';
import AudiencesQuery from 'queries/AudiencesQuery';
import UserWhoEditedATemplateQuery from 'queries/UserWhoEditedATemplateQuery';
import sortByString from 'components/utils/react-table/sortByString';
import { AttributeType } from 'bento-common/types';
import { LibraryTemplates_query$data } from 'relay-types/LibraryTemplates_query.graphql';
import { GroupTargeting } from 'bento-common/types/targeting';
import { AudiencePopoverItem } from 'components/EditorCommon/Audiences/AudiencePopoverItem';

export type LibraryTemplate =
  LibraryTemplates_query$data['templatesConnection']['edges'][number]['node'];

export const getTemplateTableFilters = (): TableFilters | any => ({
  [TemplateFilter.status]: {
    isMulti: true,
    isSelected: true,
    options: $enum(GuideStatusFilter)
      .getValues()
      .map((v) => ({
        label: v,
        value: v,
        isSelected: v !== GuideStatusFilter.removed,
      })),
  },
  [TemplateFilter.component]: {
    isMulti: true,
    options: $enum(GuideComponentFilter)
      .getValues()
      .map((v) => ({ label: v, value: v })),
  },
  [TemplateFilter.scope]: {
    options: $enum(ScopeFilter)
      .getValues()
      .map((v) => ({ label: v, value: v })),
  },
  [TemplateFilter.audience]: {
    options: [],
    noOptionsMessage: 'No audiences',
    disablesField: {
      label: TemplateFilter.user,
      message: 'You can only filter by either audience or user, not both',
    },
    asyncHydrate: async () => {
      const res = await AudiencesQuery();

      const result = (res.audiences || []).map(
        ({ entityId, name, targets }) => ({
          label: name,
          value: entityId,
          element: name ? (
            <AudiencePopoverItem targets={targets as GroupTargeting} />
          ) : null,
        })
      );

      result.sort((a, b) => sortByString(a, b, 'label', false));

      return [
        {
          label: 'Everyone',
          value: null,
          element: null,
        },
      ].concat(result);
    },
  },
  [TemplateFilter.user]: {
    options: [],
    searchable: true,
    searchPlaceholder: 'Search users...',
    noOptionsMessage: 'No users',
    disablesField: {
      label: TemplateFilter.audience,
      message: 'You can only filter by either audience or user, not both',
    },
    asyncSearch: async (input: string) => {
      try {
        const response = await RuleAttributeValuesQuery({
          name: 'email',
          type: AttributeType.accountUser,
          q: input,
        });
        return (response?.attributeValues || []).map((a) => ({
          label: a,
          value: a,
        }));
      } catch (innerError) {
        console.error(innerError);
      }
    },
  },
  [TemplateFilter.lastEditedBy]: {
    options: [],
    searchable: true,
    searchPlaceholder: 'Search editors...',
    noOptionsMessage: 'No editors',
    asyncHydrate: async () => {
      const res = await UserWhoEditedATemplateQuery();
      return (res.usersWhoEditedATemplate || [])
        .map(({ fullName, email, entityId }) => {
          const v = fullName || email;
          return {
            label: v,
            value: entityId,
          };
        })
        .sort((a, b) => sortByString(a, b, 'label', false));
    },
  },
});
