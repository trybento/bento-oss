import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import { groupBy } from 'lodash';
import { Op } from 'sequelize';
import { GraphQLDateTime } from 'graphql-iso-date';
import { entityIdField } from 'bento-common/graphql/EntityId';
import { isInputStep } from 'bento-common/data/helpers';

import globalEntityId from 'src/graphql/helpers/types/globalEntityId';
import StepPrototypeType from 'src/graphql/StepPrototype/StepPrototype.graphql';
import TemplateType, {
  LastEditedType,
} from 'src/graphql/Template/Template.graphql';
import { Module } from 'src/data/models/Module.model';
import { GraphQLContext } from 'src/graphql/types';
import { isBranchingStep } from 'src/utils/stepHelpers';
import { ModuleAutoLaunchRule } from 'src/data/models/ModuleAutoLaunchRule.model';
import { Template } from 'src/data/models/Template.model';
import ModuleAutoLaunchRuleType from '../ModuleAutoLaunchRule/ModuleAutoLaunchRule.graphql';
import AccountType from '../Account/Account.graphql';
import { GuideModule } from 'src/data/models/GuideModule.model';
import { ModuleAudit } from 'src/data/models/Audit/ModuleAudit.model';
import { User } from 'src/data/models/User.model';
import { AuditEvent } from 'src/utils/auditContext';
import { GuideModuleBase } from 'src/data/models/GuideModuleBase.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { areStepPrototypesEmpty } from '../StepPrototype/utils';
import { countJobsWithSyncKey } from 'src/jobsBull/jobs/syncTemplateChanges/syncChanges.helpers';

const ModuleTargetingDataType = new GraphQLObjectType({
  name: 'ModuleTargetingData',
  fields: () => ({
    targetTemplate: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'EntityId of the targeted template',
    },
    autoLaunchRules: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ModuleAutoLaunchRuleType))
      ),
    },
  }),
});

const ModuleType = new GraphQLObjectType<Module, GraphQLContext>({
  name: 'Module',
  description: 'A standalone module of steps',
  fields: () => ({
    ...globalEntityId('Module'),
    ...entityIdField(),
    updatedAt: {
      type: GraphQLDateTime,
    },
    name: {
      type: GraphQLString,
      description: 'The name of the module',
    },
    displayTitle: {
      type: GraphQLString,
      description: 'The title displayed in the guides created from the module.',
      deprecationReason: 'Use `name` instead',
      resolve: (module, _, _ctx) => module.name,
    },
    description: {
      type: GraphQLString,
      description: 'The description of the module',
    },
    templates: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(TemplateType))
      ),
      description: 'The templates in which this module is being used',
      resolve: (module, _, { loaders }) =>
        loaders.templatesUsingModuleLoader.load(module.id),
    },
    dynamicTemplates: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(TemplateType))
      ),
      description: 'The templates in which this module is added to dynamically',
      resolve: (module, _, { loaders }) =>
        loaders.templatesUsingModuleDynamicallyLoader.load(module.id),
    },
    isCyoa: {
      type: GraphQLBoolean,
      description: 'Whether this step group is CYOA',
    },
    hasBranchingStep: {
      type: GraphQLBoolean,
      resolve: async (module, _, { loaders }) => {
        const stepPrototypes = await loaders.stepPrototypesOfModuleLoader.load(
          module.id
        );

        return stepPrototypes.some((sp) => isBranchingStep(sp.stepType));
      },
    },
    hasInputStep: {
      type: GraphQLBoolean,
      resolve: async (module, _, { loaders }) => {
        const stepPrototypes = await loaders.stepPrototypesOfModuleLoader.load(
          module.id
        );

        return stepPrototypes.some((sp) => isInputStep(sp.stepType));
      },
    },
    stepPrototypes: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(StepPrototypeType))
      ),
      description: 'The step prototypes included as part of this module',
      resolve: (module, _, { loaders }) =>
        loaders.stepPrototypesOfModuleLoader.load(module.id),
    },
    numberOfAccountsWithUnmodifiedGuides: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'The number of accounts with unmodified guides created from this template',
      resolve: (module, _, { loaders }) =>
        loaders.numberOfAccountsWithUnmodifiedGuidesConnectedToModuleLoader.load(
          module.id
        ),
    },
    lastEdited: {
      type: LastEditedType,
      resolve: async (module) => {
        const lastEditAudit = await ModuleAudit.findOne({
          attributes: ['createdAt'],
          include: [
            {
              model: User,
            },
          ],
          where: {
            moduleId: module.id,
            eventName: {
              [Op.not]: [
                AuditEvent.launched,
                AuditEvent.manualLaunch,
                AuditEvent.paused,
              ],
            },
          },
          order: [['createdAt', 'DESC']],
        });

        if (lastEditAudit)
          return {
            timestamp: lastEditAudit.createdAt,
            user: lastEditAudit.user,
          };

        const createdByUser = await module.$get('createdByUser');

        return {
          timestamp: module.updatedAt,
          user: createdByUser,
        };
      },
    },
    lastUsedAt: {
      type: GraphQLDateTime,
      description: 'When was the module was last used',
      resolve: async (module, _a, { loaders }) => {
        const guideModule = await GuideModule.findOne({
          where: {
            createdFromModuleId: module.id,
          },
          order: [['createdAt', 'DESC']],
        });

        if (guideModule) {
          loaders.guideModuleEntityLoader.prime(
            guideModule.entityId,
            guideModule
          );
          loaders.guideModuleLoader.prime(guideModule.id, guideModule);
        }

        return guideModule?.createdAt;
      },
    },
    propagationQueue: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Number of pending propagation jobs as a result of saving',
      resolve: (module) => countJobsWithSyncKey('module', module.id),
    },
    propagationCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'How many guides this will eventually touch',
      resolve: async (module) => {
        return await GuideModule.count({
          where: {
            createdFromModuleId: module.id,
          },
          include: [
            {
              model: GuideModuleBase,
              required: true,
              include: [
                { model: GuideBase.scope(['receivesPropagation', 'active']) },
              ],
            },
          ],
        });
      },
    },
    isDynamic: {
      type: GraphQLBoolean,
      description: 'If this module is appended dynamically to anything',
      resolve: async (module) => {
        const targetingData = await ModuleAutoLaunchRule.findOne({
          where: {
            moduleId: module.id,
          },
          attributes: ['id'],
        });

        return !!targetingData;
      },
    },
    targetingData: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ModuleTargetingDataType))
      ),
      description: 'Rules for dynamic module targeting',
      resolve: async (module) => {
        const allTargeting = await ModuleAutoLaunchRule.findAll({
          where: {
            moduleId: module.id,
          },
          include: [{ model: Template, attributes: ['entityId'] }],
        });

        if (allTargeting.length === 0) return [];

        // TODO: Improve performance.
        const targetingGroupedBy = groupBy(
          allTargeting,
          (targeting) => targeting.targetTemplate.entityId
        );

        return Object.entries(targetingGroupedBy).map(
          ([targetTemplateEntityId, targeting]) => ({
            targetTemplate: targetTemplateEntityId,
            autoLaunchRules: targeting,
          })
        );
      },
    },
    isEmpty: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Indicates whether the module is empty based on step body content',
      resolve: async (module, _, { loaders }) => {
        const stepPrototypes = await loaders.stepPrototypesOfModuleLoader.load(
          module.id
        );

        return areStepPrototypesEmpty(stepPrototypes);
      },
    },
  }),
});

export default ModuleType;
