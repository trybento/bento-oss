import { GuideCategory } from 'bento-common/types';
import { ExtractedFilterSelections } from 'bento-common/types/filters';

import { Template } from 'src/data/models/Template.model';
import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import {
  activeFilter,
  audienceFilter,
  fetchFilteringContexts,
  userFlightPathFilter,
} from './fetchTemplate.helpers';

type Args = {
  organizationId: number;
  autoLaunchableOnly?: boolean;
  includeArchived?: boolean;
  activeOnly?: boolean;
  includeTemplates?: boolean;
  /** Filters */
  audienceEntityId?: string;
  userEmail?: string;
  category?: GuideCategory;
  /** Account flightpaths not yet implemented. maybe never */
  accountName?: string;
  /** Preloaded and ordered templates */
  templates?: Template[];
  filters?: ExtractedFilterSelections;
  search?: string;
};

/** What we get from gql */
export type FetchTemplateArgs = Omit<
  Args,
  'organizationId' | 'accountName' | 'templates'
>;

/**
 * Find templates for the library page matching included filters
 */
export default async function fetchTemplates(args: Args) {
  const {
    organizationId,
    autoLaunchableOnly,
    includeArchived,
    audienceEntityId,
    userEmail,
    activeOnly,
    category,
    includeTemplates = false,
    templates,
  } = args;

  const allTemplates = templates
    ? templates
    : await fetchAllTemplates({
        organizationId,
        includeArchived,
        autoLaunchableOnly,
        includeTargeting: !!audienceEntityId || !!userEmail,
        category,
        includeTemplates,
      });

  const filteringCtx = await fetchFilteringContexts(args, allTemplates);

  /* zero conditions */
  if (audienceEntityId && !filteringCtx.audience) return [];

  /* Filters */
  const filtered = allTemplates.filter((template) => {
    const { audience } = filteringCtx;

    /* Filter through plugins */
    if (audienceEntityId && !audienceFilter(audience!, template)) return false;

    if (userEmail && !userFlightPathFilter(filteringCtx, template))
      return false;

    if (activeOnly && !activeFilter(filteringCtx, template)) return false;

    return true;
  });

  return filtered;
}

const fetchAllTemplates = ({
  organizationId,
  autoLaunchableOnly,
  includeTargeting,
  includeArchived,
  category = GuideCategory.content,
  includeTemplates,
}: {
  organizationId: number;
  autoLaunchableOnly?: boolean;
  includeTargeting?: boolean;
  includeArchived?: boolean;
  category?: GuideCategory;
  includeTemplates?: boolean;
}) =>
  Template.scope([
    ...(category === GuideCategory.all
      ? []
      : [
          category === GuideCategory.splitTest
            ? 'splitTestTemplates'
            : category === GuideCategory.content
            ? 'contentTemplates'
            : '',
        ]),
    ...(includeTemplates ? [] : ['excludeTemplates']),
  ]).findAll({
    where: {
      organizationId: organizationId,
      ...(autoLaunchableOnly
        ? {
            isAutoLaunchEnabled: true,
          }
        : {}),
      ...(includeArchived ? {} : { archivedAt: null }),
    },
    ...(includeTargeting
      ? {
          include: [TemplateTarget, TemplateAutoLaunchRule],
        }
      : {}),
    order: [
      autoLaunchableOnly || includeTargeting
        ? ['priorityRanking', 'ASC']
        : ['updatedAt', 'DESC'],
    ],
  });

export { FetchTemplateGqlArgs } from './fetchTemplate.helpers';
