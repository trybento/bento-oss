import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull } from 'graphql';

import generateMutation from 'src/graphql/helpers/generateMutation';
import ModuleType from 'src/graphql/Module/Module.graphql';

import { Module } from 'src/data/models/Module.model';
import AuditContext, { AuditType } from 'src/utils/auditContext';
import editModule from 'src/interactions/library/editModule';
import { ModuleInput, ModuleInputType } from './moduleMutations.helpers';
import { AutoLaunchRuleInputType } from 'src/graphql/Template/mutations/setAutoLaunchRulesAndTargetsForTemplate';
import { EntityId } from 'src/graphql/helpers/types';
import setTargetingForModule, {
  ModuleTargetingData,
} from 'src/interactions/targeting/setTargetingForModule';
import { enableDynamicModules } from 'src/utils/features';
import { ModuleAutoLaunchRule } from 'src/data/models/ModuleAutoLaunchRule.model';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';

export const ModuleTargetingDataInputType = new GraphQLInputObjectType({
  name: 'ModuleTargetingDataInputType',
  fields: {
    targetTemplate: {
      type: new GraphQLNonNull(EntityId),
    },
    autoLaunchRules: {
      type: new GraphQLList(new GraphQLNonNull(AutoLaunchRuleInputType)),
    },
  },
});

type Args = {
  moduleData: ModuleInput;
  targetingData?: ModuleTargetingData[];
};

export default generateMutation<unknown, Args>({
  name: 'EditModule',
  description: 'Editing an existing module',
  inputFields: {
    moduleData: {
      type: new GraphQLNonNull(ModuleInputType),
    },
    targetingData: {
      type: new GraphQLList(new GraphQLNonNull(ModuleTargetingDataInputType)),
    },
  },
  outputFields: {
    module: {
      type: ModuleType,
    },
  },
  mutateAndGetPayload: async (
    { moduleData, targetingData },
    { organization, user }
  ) => {
    const module = await Module.findOne({
      where: {
        entityId: moduleData.entityId,
      },
    });

    if (!module) return { errors: ['Module not found'] };

    const auditContext = new AuditContext({
      type: AuditType.Module,
      modelId: module.id,
      organizationId: organization.id,
      userId: user.id,
    });

    await editModule(
      { module, moduleData, organization, user },
      { auditContext }
    );

    const useDynamicModules = await enableDynamicModules.enabled(organization);

    if (useDynamicModules) {
      await ModuleAutoLaunchRule.destroy({ where: { moduleId: module.id } });

      if (targetingData && targetingData.length)
        for (const target of targetingData) {
          await setTargetingForModule({ module, targetingData: target });
        }
    }

    await queueJob({
      jobType: JobType.SyncTemplateChanges,
      type: 'module',
      moduleId: module.id,
      organizationId: organization.id,
    });

    return { module };
  },
});
