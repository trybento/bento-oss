import { GraphQLNonNull, GraphQLString } from 'graphql';
import promises from 'src/utils/promises';
import { QATool } from 'bento-common/types';
import { Template } from 'src/data/models/Template.model';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import { RollupTypeEnum } from 'src/jobsBull/jobs/rollupTasks/rollup.constants';
import { IS_DEVELOPMENT, IS_STAGING } from 'src/utils/constants';
import { logger } from 'src/utils/logger';
import setAutoLaunchConfig from '../../interactions/targeting/setAutoLaunch.helpers';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { FeatureFlagEnabled } from 'src/data/models/FeatureFlagEnabled.model';
import { graphQlError } from '../utils';
import {
  runAvailableGuides,
  runLaunchingDiagnostics,
} from 'src/interactions/troubleshooter/troubleshooting';
import { FeatureFlag } from 'src/data/models/FeatureFlag.model';
import { getRedisClient } from 'src/utils/redis';
import { RedisConnections } from 'src/utils/redis/getRedisClient';
import duplicateTemplate, {
  shouldDuplicateStepGroups,
} from 'src/interactions/library/duplicateTemplate';
import { queryRunner } from 'src/data';

const redis = getRedisClient(RedisConnections.general);

type QARequestArgs = {
  request: string;
  param?: string;
  paramTwo?: string;
};

export default generateMutation({
  name: 'QARequest',
  inputFields: {
    request: {
      type: new GraphQLNonNull(GraphQLString),
    },
    param: {
      type: GraphQLString,
    },
    paramTwo: {
      type: GraphQLString,
    },
  },
  outputFields: {
    result: {
      type: new GraphQLNonNull(GraphQLString),
    },
    jsonString: {
      description: 'Random data serialized as JSON',
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async (
    { request, param, paramTwo }: QARequestArgs,
    { user, organization }
  ) => {
    if (!IS_STAGING && !IS_DEVELOPMENT) return graphQlError('Not supported');
    if (!user.isSuperadmin) return graphQlError('Go away');

    logger.info(`[QATools] New QA tool request: ${request}:${param || ''}`);

    let result = `😿 QA Tool "${request}" not supported`;
    let jsonString = '';

    switch (request) {
      case QATool.rollup: {
        await Promise.all([
          queueJob({
            jobType: JobType.QueueRollup,
            rollupType: RollupTypeEnum.AnalyticRollups,
          }),
          queueJob({
            jobType: JobType.QueueRollup,
            rollupType: RollupTypeEnum.GuideRollups,
          }),
        ]);

        result = 'Rollup jobs queued. Give it a few minutes';
        break;
      }
      case QATool.bulkPause: {
        const activeTemplates = await Template.findAll({
          where: {
            isAutoLaunchEnabled: true,
            organizationId: organization.id,
          },
        });

        await promises.map(activeTemplates, (template) =>
          setAutoLaunchConfig(
            {
              template,
              onlySetAutolaunchState: true,
              isAutoLaunchEnabled: false,
            },
            { organization, user }
          )
        );

        result = 'Autolaunched guides paused';
        break;
      }
      case QATool.analyticsBackfill: {
        await Promise.all([
          queueJob({
            jobType: JobType.UpdateGuideData,
            organizationId: organization.id,
          }),
          queueJob({
            jobType: JobType.UpdateStepData,
            organizationId: organization.id,
          }),
          queueJob({
            jobType: JobType.RunDataUsageCache,
          }),
        ]);

        result = 'Backfills queued, definitely may take a while';
        break;
      }
      case QATool.massClone: {
        const allTemplates = await Template.findAll({
          where: {
            organizationId: organization.id,
          },
        });

        if (!param) {
          result = 'No filter provided';
          break;
        }

        let count = 0;

        for (const template of allTemplates) {
          if (!template.name) continue;
          if (!template.name.includes(param)) continue;

          await duplicateTemplate({
            template,
            organization,
            useExistingModules: shouldDuplicateStepGroups(template),
            ...(paramTwo
              ? { customName: template.name.replace(param, paramTwo) }
              : { preserveName: false }),
          });

          count++;
        }

        result = `Duplicated ${count} templates`;
        break;
      }
      case QATool.launchDiagnostics: {
        const accountUser = await AccountUser.findOne({
          where: {
            organizationId: organization.id,
            externalId: param,
          },
          attributes: ['entityId'],
        });

        if (!accountUser) return graphQlError('No account user found');

        const report = await runLaunchingDiagnostics({
          accountUserEntityId: accountUser.entityId,
          searchableOrgIds: [organization.id],
        });

        jsonString = JSON.stringify(report);
        result = 'Launch diagnostic requested';
        break;
      }
      case QATool.availableGuides: {
        const accountUser = await AccountUser.findOne({
          where: {
            organizationId: organization.id,
            externalId: param,
          },
          attributes: ['entityId', 'id'],
        });

        if (!accountUser) return graphQlError('No account user found');

        const guides = await runAvailableGuides({ accountUser });

        jsonString = JSON.stringify(guides);
        result = 'Available guides requested';
        break;
      }
      case QATool.clearFeatureFlagCache: {
        const ffList = await FeatureFlag.findAll({});

        await promises.each(ffList, async (ff) => {
          await redis.del(`ff:${organization.id}:${ff.name}`);
        });

        result = 'Feature flag cache cleared, I think';
        break;
      }
      case QATool.getFFs: {
        const sql = `SELECT
					ff.name,
					ff.enabled_for_all AS "enabledForAll",
					(CASE WHEN ffe.id IS NULL THEN FALSE ELSE TRUE END) AS enabled
				FROM core.feature_flags ff
				LEFT JOIN core.feature_flag_enabled ffe
					ON ff.id = ffe.feature_flag_id AND ffe.organization_id = :orgId
				ORDER BY name ASC;`;

        const ffs = await queryRunner({
          sql,
          replacements: { orgId: organization.id },
        });

        result = 'Done';
        jsonString = JSON.stringify({ ffs });
        break;
      }
      case QATool.setFF: {
        const ffName = param;
        const newState = paramTwo as 'true' | 'false';

        const targetFf = await FeatureFlag.findOne({
          where: {
            name: ffName,
          },
        });

        if (!targetFf) {
          result = 'FF Not found';
          break;
        }

        logger.debug(`[qaTools] toggle "${targetFf.name}" to ${paramTwo}`);

        if (newState === 'true') {
          await FeatureFlagEnabled.create(
            {
              organizationId: organization.id,
              featureFlagId: targetFf.id,
            },
            {
              ignoreDuplicates: true,
            }
          );
        } else {
          await FeatureFlagEnabled.destroy({
            where: {
              organizationId: organization.id,
              featureFlagId: targetFf.id,
            },
          });
        }

        result = `${newState === 'true' ? 'Enabled' : 'Disabled'} "${ffName}"`;
        break;
      }
      default:
    }

    return { result, jsonString };
  },
});
