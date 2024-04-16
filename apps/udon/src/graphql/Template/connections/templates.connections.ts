import { GraphQLInt, GraphQLNonNull } from 'graphql';
import {
  connectionDefinitions,
  connectionArgs,
  GraphQLConnectionDefinitions,
} from 'graphql-relay';
import { OrderDirection } from 'src/graphql/helpers/types';
import {
  FetchTemplateGqlArgs,
  audienceFilter,
  fetchFilteringContexts,
  userFlightPathFilter,
} from 'src/interactions/library/fetchTemplate.helpers';
import {
  ConnectionArgs,
  connectionFromSqlResult,
  sqlFromConnectionArgs,
} from 'src/graphql/helpers/sqlRelayHelpers';
import { sequelize } from 'src/data';
import TemplateType from '../Template.graphql';
import { GraphQLContext } from 'src/graphql/types';
import { FetchTemplateArgs } from 'src/interactions/library/fetchTemplates';
import {
  GuideCategory,
  GuideFormFactor,
  GuideTypeEnum,
  TemplateState,
  Theme,
} from 'bento-common/types';
import { Template } from 'src/data/models/Template.model';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import {
  GuideComponentFilter,
  GuideStatusFilter,
  ScopeFilter,
  TemplateFilter,
} from 'bento-common/types/filters';
import {
  BindOrReplacements,
  InferAttributes,
  Op,
  WhereOptions,
} from 'sequelize';
import { enumToGraphqlEnum } from 'src/../../common/utils/graphql';
import { Literal } from 'sequelize/types/utils';
import { User } from 'src/data/models/User.model';
import { DEFAULT_PRIORITY_RANKING } from 'src/../../common/utils/constants';
import { isInlineContextualGuideSql } from 'src/../../common/utils/formFactor';
import { isTemplateLiveSql } from './templateFilter.helpers';

export enum OrderBy {
  name = 'name',
  priorityRanking = 'priorityRanking',
  state = 'state',
  scope = 'scope',
  editedAt = 'editedAt',
  editedBy = 'editedBy',
  lastUsedAt = 'lastUsedAt',
}

const guideStatusFilterToTemplateState: {
  [key in Exclude<
    GuideStatusFilter,
    GuideStatusFilter.template
  >]: TemplateState;
} = {
  [GuideStatusFilter.live]: TemplateState.live,
  [GuideStatusFilter.draft]: TemplateState.draft,
  [GuideStatusFilter.stopped]: TemplateState.stopped,
  [GuideStatusFilter.removed]: TemplateState.removed,
};

const orderByToColumn: {
  [key in OrderBy]: [string | Literal] | [string, string | Literal];
} = {
  [OrderBy.name]: [sequelize.literal('COALESCE(private_name, name)')],
  [OrderBy.state]: ['state_rank'],
  [OrderBy.priorityRanking]: ['priority_ranking_adjusted'],
  [OrderBy.scope]: ['type'],
  [OrderBy.editedAt]: ['edited_at_with_fallback'],
  [OrderBy.editedBy]: ['editedByUser', 'full_name'],
  [OrderBy.lastUsedAt]: ['last_used_at'],
};

const scopeFilterToGuideTypeEnum: {
  [key in ScopeFilter]: GuideTypeEnum;
} = {
  [ScopeFilter.account]: GuideTypeEnum.account,
  [ScopeFilter.user]: GuideTypeEnum.user,
};

const guideComponentFilterToConditions: {
  [key in GuideComponentFilter]: WhereOptions<InferAttributes<Template>>;
} = {
  [GuideComponentFilter.onboarding]: {
    isSideQuest: false,
    isCyoa: { [Op.not]: true },
  },
  [GuideComponentFilter.cyoa]: { isCyoa: true },
  [GuideComponentFilter.tooltip]: { formFactor: GuideFormFactor.tooltip },
  [GuideComponentFilter.flow]: { formFactor: GuideFormFactor.flow },
  [GuideComponentFilter.contextualSidebar]: {
    isSideQuest: true,
    formFactor: GuideFormFactor.sidebar,
  },
  [GuideComponentFilter.modal]: { formFactor: GuideFormFactor.modal },
  [GuideComponentFilter.banner]: { formFactor: GuideFormFactor.banner },
  [GuideComponentFilter.carousel]: { theme: Theme.carousel },
  [GuideComponentFilter.card]: { theme: Theme.card },
  [GuideComponentFilter.videoGallery]: { theme: Theme.videoGallery },
};

const guideCategoryToConditions: {
  [key in GuideCategory]: WhereOptions<InferAttributes<Template>>;
} = {
  [GuideCategory.all]: {},
  [GuideCategory.content]: { type: { [Op.not]: GuideTypeEnum.splitTest } },
  [GuideCategory.splitTest]: { type: GuideTypeEnum.splitTest },
};

let connectionDetails: GraphQLConnectionDefinitions;

export const getConnectionDetails = () => {
  if (connectionDetails) return connectionDetails;

  connectionDetails = connectionDefinitions({
    name: 'TemplatesConnection',
    // @ts-expect-error Node type should be non-nullable
    nodeType: new GraphQLNonNull(TemplateType),
    connectionFields: {
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      total: { type: GraphQLInt },
    },
  });

  return connectionDetails;
};

const TemplatesOrderByEnumType = enumToGraphqlEnum({
  name: 'TemplatesOrderBy',
  enumType: OrderBy,
  description: 'Column to order the template library page by',
});

export function templatesConnections() {
  const { connectionType } = getConnectionDetails();

  return {
    type: connectionType,
    args: {
      ...connectionArgs,
      ...FetchTemplateGqlArgs,
      orderBy: {
        type: TemplatesOrderByEnumType,
      },
      orderDirection: {
        type: OrderDirection,
      },
    },
    resolve: async (
      _,
      args: FetchTemplateArgs & ConnectionArgs<OrderBy>,
      { organization }: GraphQLContext
    ) => {
      const {
        filters,
        orderBy,
        orderDirection,
        category = GuideCategory.content,
        userEmail,
        audienceEntityId,
        search,
      } = args;
      const { limit = 20, offset = 0 } = sqlFromConnectionArgs(args);
      const where: WhereOptions<InferAttributes<Template>>[] = [];
      let replacements: BindOrReplacements = {};

      if (filters) {
        const statusFilters = filters[TemplateFilter.status];
        const componentFilters = filters[TemplateFilter.component];
        const scopeFilters = filters[TemplateFilter.scope];
        const lastEditedByFilters = filters[TemplateFilter.lastEditedBy];

        if (statusFilters) {
          const selectedStates = Object.entries(statusFilters)
            .filter(
              ([state, selected]) =>
                state !== GuideStatusFilter.template && selected
            )
            .map(([state]) => guideStatusFilterToTemplateState[state]);

          replacements = { ...replacements, selectedStates };

          const isTemplate = statusFilters[GuideStatusFilter.template];

          where.push({
            [Op.or]: [
              {
                state: selectedStates,
                isTemplate: false,
                manuallyLaunched: false,
              },
              ...(selectedStates.length > 0
                ? [
                    {
                      [Op.and]: [
                        { manuallyLaunched: true },
                        sequelize.literal(`--sql
                          CASE
                            WHEN state IN ('${TemplateState.draft}', '${TemplateState.stopped}') AND manually_launched = TRUE THEN '${TemplateState.live}'
                            ELSE state
                          END IN (:selectedStates)
                        `),
                      ],
                    },
                  ]
                : []),
              ...(isTemplate !== undefined ? [{ isTemplate }] : []),
            ],
          });
        }

        if (componentFilters) {
          const componentConditions = Object.entries(componentFilters)
            .filter(([, selected]) => selected)
            .map(([component]) => guideComponentFilterToConditions[component]);

          where.push({ [Op.or]: componentConditions });
        }

        if (scopeFilters) {
          const selectedScopes = Object.entries(scopeFilters)
            .filter(([, selected]) => selected)
            .map(([component]) => scopeFilterToGuideTypeEnum[component]);

          where.push({ type: selectedScopes });
        }

        if (lastEditedByFilters) {
          const users = await User.findAll({
            where: {
              entityId: Object.entries(filters[TemplateFilter.lastEditedBy])
                .filter(([, selected]) => selected)
                .map(([entityId]) => entityId),
            },
            attributes: ['id'],
          });

          where.push({ editedByUserId: users.map((u) => u.id) });
        }
      }

      const order = [
        [
          ...(orderBy ? orderByToColumn[orderBy] : ['id']),
          orderDirection || 'ASC',
        ],
        // Add secondary order on `id` if ordering by another column to keep consistent ordering for equal values
        ...(orderBy ? [['id', 'ASC']] : []),
      ] as any;

      const usingFlightPaths = !!userEmail || !!audienceEntityId;

      const templates = await Template.findAll({
        attributes: {
          include: [
            [
              sequelize.literal(`--sql
                CASE
                  WHEN is_template = TRUE THEN 4
                  WHEN ${isTemplateLiveSql()} THEN 0
                  WHEN state = '${TemplateState.draft}' THEN 1
                  WHEN state = '${TemplateState.stopped}' THEN 2
                  WHEN state = '${TemplateState.removed}' THEN 3
                  ELSE 9
                END
              `),
              'state_rank',
            ],
            [
              sequelize.literal(`--sql
                CASE
                  WHEN NOT (${isInlineContextualGuideSql()}) AND (${isTemplateLiveSql()}) THEN priority_ranking
                  ELSE ${DEFAULT_PRIORITY_RANKING}
                END
              `),
              'priority_ranking_adjusted',
            ],
            [
              sequelize.fn(
                'COALESCE',
                sequelize.col('Template.edited_at'),
                sequelize.col('Template.created_at')
              ),
              'edited_at_with_fallback',
            ],
          ],
        },
        where: {
          organizationId: organization.id,
          ...guideCategoryToConditions[category],
          ...(where.length > 0 ? { [Op.and]: where } : {}),
          ...(search !== undefined && search !== '' && search !== null
            ? {
                [Op.or]: [
                  { privateName: { [Op.iLike]: `%${search}%` } },
                  { privateName: null, name: { [Op.iLike]: `%${search}%` } },
                  { privateName: '', name: { [Op.iLike]: `%${search}%` } },
                ],
              }
            : {}),
        },
        include: [
          { association: Template.associations.editedByUser, required: false },
          ...(usingFlightPaths ? [TemplateTarget, TemplateAutoLaunchRule] : []),
        ],
        order,
        ...(!usingFlightPaths ? { limit, offset } : {}),
        replacements,
      });

      let values = templates;

      if (usingFlightPaths) {
        const filteringContext = await fetchFilteringContexts(
          { ...args, organizationId: organization.id },
          templates
        );

        values = templates
          .flatMap((template) => {
            if (
              audienceEntityId &&
              filteringContext.audience &&
              !audienceFilter(filteringContext.audience, template)
            ) {
              return [];
            }

            if (
              userEmail &&
              !userFlightPathFilter(filteringContext, template)
            ) {
              return [];
            }

            return [template];
          })
          .slice(offset, offset + limit);
      }

      return connectionFromSqlResult({
        values: values as any,
        source: null,
        args,
        skipFullCount: true,
      });
    },
  };
}
