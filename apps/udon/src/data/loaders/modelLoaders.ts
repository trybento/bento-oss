import DataLoader from 'dataloader';
import { keyBy } from 'lodash';

import { AuthType } from 'src/data/models/types';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Audience } from 'src/data/models/Audience.model';
import { BranchingPath } from 'src/data/models/BranchingPath.model';
import { CustomApiEvent } from 'src/data/models/CustomApiEvent.model';
import { CustomAttribute } from 'src/data/models/CustomAttribute.model';
import { CustomAttributeValue } from 'src/data/models/CustomAttributeValue.model';
import { Guide } from 'src/data/models/Guide.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideBaseStepAutoCompleteInteraction } from 'src/data/models/GuideBaseStepAutoCompleteInteraction.model';
import { GuideBaseStepCta } from 'src/data/models/GuideBaseStepCta.model';
import { GuideModule } from 'src/data/models/GuideModule.model';
import { GuideModuleBase } from 'src/data/models/GuideModuleBase.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import { InputStepAnswer } from 'src/data/models/inputStepAnswer.model';
import { InputStepBase } from 'src/data/models/inputStepBase.model';
import { InputStepPrototype } from 'src/data/models/InputStepPrototype.model';
import { Module } from 'src/data/models/Module.model';
import { ModuleStepPrototype } from 'src/data/models/ModuleStepPrototype.model';
import { Organization } from 'src/data/models/Organization.model';
import { OrganizationSettings } from 'src/data/models/OrganizationSettings.model';
import { OrganizationData } from 'src/data/models/Analytics/OrganizationData.model';
import { SegmentApiKey } from 'src/data/models/SegmentApiKey.model';
import { Step } from 'src/data/models/Step.model';
import { StepAutoCompleteInteraction } from 'src/data/models/StepAutoCompleteInteraction.model';
import { StepEventMapping } from 'src/data/models/StepEventMapping.model';
import { StepEventMappingRule } from 'src/data/models/StepEventMappingRule.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { StepPrototypeAutoCompleteInteraction } from 'src/data/models/StepPrototypeAutoCompleteInteraction.model';
import { StepPrototypeCta } from 'src/data/models/StepPrototypeCta.model';
import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import { StepTaggedElement } from 'src/data/models/StepTaggedElement.model';
import { Template } from 'src/data/models/Template.model';
import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import { TemplateModule } from 'src/data/models/TemplateModule.model';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import { TriggeredBranchingPath } from '../models/TriggeredBranchingPath.model';
import { User } from 'src/data/models/User.model';
import { UserOrganization } from 'src/data/models/UserOrganization.model';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import UserAuth from 'src/data/models/UserAuth.model';
import { Webhook } from '../models/Integrations/Webhook.model';
import { IntegrationApiKey } from '../models/IntegrationApiKey.model';
import { GuideData } from '../models/Analytics/GuideData.model';
import Media from '../models/Media.model';
import MediaReference from '../models/MediaReference.model';
import NpsSurvey from '../models/NetPromoterScore/NpsSurvey.model';
import { TemplateAudience } from '../models/TemplateAudience.model';

export interface ModelLoaders {
  accountLoader: DataLoader<number, Account>;
  accountEntityLoader: DataLoader<string, Account>;
  accountUserLoader: DataLoader<number, AccountUser>;
  accountUserEntityLoader: DataLoader<string, AccountUser>;
  audienceLoader: DataLoader<number, Audience>;
  audienceEntityLoader: DataLoader<string, Audience>;
  branchingPathLoader: DataLoader<number, BranchingPath>;
  branchingPathEntityLoader: DataLoader<string, BranchingPath>;
  customAttributeLoader: DataLoader<number, CustomAttribute>;
  customAttributeEntityLoader: DataLoader<string, CustomAttribute>;
  customAttributeValueLoader: DataLoader<number, CustomAttributeValue>;
  customAttributeValueEntityLoader: DataLoader<string, CustomAttributeValue>;
  customApiEventLoader: DataLoader<number, CustomApiEvent>;
  customApiEventEntityLoader: DataLoader<string, CustomApiEvent>;
  userAuthLoader: DataLoader<[number, AuthType], UserAuth | null>;
  guideLoader: DataLoader<number, Guide>;
  guideEntityLoader: DataLoader<string, Guide>;
  guideBaseLoader: DataLoader<number, GuideBase>;
  guideBaseEntityLoader: DataLoader<string, GuideBase>;
  guideModuleLoader: DataLoader<number, GuideModule>;
  guideModuleEntityLoader: DataLoader<string, GuideModule>;
  guideModuleBaseLoader: DataLoader<number, GuideModuleBase>;
  guideModuleBaseEntityLoader: DataLoader<string, GuideModuleBase>;
  guideBaseStepCtaLoader: DataLoader<number, GuideBaseStepCta>;
  guideBaseStepCtaEntityLoader: DataLoader<string, GuideBaseStepCta>;
  guideBaseStepAutoCompleteInteractionLoader: DataLoader<
    number,
    GuideBaseStepAutoCompleteInteraction
  >;
  guideDataLoader: DataLoader<number, GuideData>;
  guideDataEntityLoader: DataLoader<string, GuideData>;
  guideParticipantLoader: DataLoader<number, GuideParticipant>;
  guideParticipantEntityLoader: DataLoader<string, GuideParticipant>;
  guideStepBaseLoader: DataLoader<number, GuideStepBase>;
  guideStepBaseEntityLoader: DataLoader<string, GuideStepBase>;
  mediaLoader: DataLoader<number, Media>;
  mediaReferenceLoader: DataLoader<number, MediaReference>;
  moduleLoader: DataLoader<number, Module>;
  moduleEntityLoader: DataLoader<string, Module>;
  moduleStepPrototypeLoader: DataLoader<number, ModuleStepPrototype>;
  moduleStepPrototypeEntityLoader: DataLoader<string, ModuleStepPrototype>;
  organizationLoader: DataLoader<number, Organization>;
  organizationSettingsLoader: DataLoader<number, OrganizationSettings>;
  organizationDataLoader: DataLoader<number, OrganizationData>;
  organizationInlineEmbedLoader: DataLoader<number, OrganizationInlineEmbed>;
  organizationInlineEmbedEntityLoader: DataLoader<
    string,
    OrganizationInlineEmbed
  >;
  organizationEntityLoader: DataLoader<string, Organization>;
  segmentApiKeyLoader: DataLoader<number, SegmentApiKey>;
  segmentApiKeyEntityLoader: DataLoader<string, SegmentApiKey>;
  integrationApiKeyLoader: DataLoader<number, IntegrationApiKey>;
  integrationApiKeyEntityLoader: DataLoader<string, IntegrationApiKey>;
  stepLoader: DataLoader<number, Step>;
  stepEntityLoader: DataLoader<string, Step>;
  stepEventMappingLoader: DataLoader<number, StepEventMapping>;
  stepEventMappingEntityLoader: DataLoader<string, StepEventMapping>;
  stepEventMappingRuleLoader: DataLoader<number, StepEventMappingRule>;
  stepAutoCompleteInteractionLoader: DataLoader<
    number,
    StepAutoCompleteInteraction
  >;
  stepEventMappingRuleEntityLoader: DataLoader<string, StepEventMappingRule>;
  stepPrototypeLoader: DataLoader<number, StepPrototype>;
  stepPrototypeEntityLoader: DataLoader<string, StepPrototype>;
  stepPrototypeCtaLoader: DataLoader<number, StepPrototypeCta>;
  stepPrototypeCtaEntityLoader: DataLoader<string, StepPrototypeCta>;
  stepPrototypeAutoCompleteInteractionLoader: DataLoader<
    number,
    StepPrototypeAutoCompleteInteraction
  >;
  stepPrototypeAutoCompleteInteractionEntityLoader: DataLoader<
    string,
    StepPrototypeAutoCompleteInteraction
  >;
  stepPrototypeTaggedElementLoader: DataLoader<
    number,
    StepPrototypeTaggedElement
  >;
  stepPrototypeTaggedElementEntityLoader: DataLoader<
    string,
    StepPrototypeTaggedElement
  >;
  stepTaggedElementLoader: DataLoader<number, StepTaggedElement>;
  stepTaggedElementEntityLoader: DataLoader<string, StepTaggedElement>;
  templateLoader: DataLoader<number, Template>;
  templateEntityLoader: DataLoader<string, Template>;
  templateAutoLaunchRuleLoader: DataLoader<number, TemplateAutoLaunchRule>;
  templateAutoLaunchRuleEntityLoader: DataLoader<
    string,
    TemplateAutoLaunchRule
  >;
  templateTargetLoader: DataLoader<number, TemplateTarget>;
  templateTargetEntityLoader: DataLoader<string, TemplateTarget>;
  templateAudienceLoader: DataLoader<number, TemplateAudience>;
  templateAudienceEntityLoader: DataLoader<string, TemplateAudience>;
  templateModuleLoader: DataLoader<number, TemplateModule>;
  templateModuleEntityLoader: DataLoader<string, TemplateModule>;
  triggeredBranchingPathLoader: DataLoader<number, TriggeredBranchingPath>;
  userLoader: DataLoader<number, User>;
  userEntityLoader: DataLoader<string, User>;
  userOrganizationLoader: DataLoader<number, UserOrganization>;
  userOrganizationEntityLoader: DataLoader<string, UserOrganization>;
  webhookLoader: DataLoader<number, Webhook>;
  webhookEntityLoader: DataLoader<string, Webhook>;
  inputStepPrototypeLoader: DataLoader<number, InputStepPrototype>;
  inputStepPrototypeEntityLoader: DataLoader<string, InputStepPrototype>;
  inputStepBaseLoader: DataLoader<number, InputStepBase>;
  inputStepBaseEntityLoader: DataLoader<string, InputStepBase>;
  inputStepAnswerLoader: DataLoader<number, InputStepAnswer>;
  inputStepAnswerEntityLoader: DataLoader<string, InputStepAnswer>;
  npsSurveyEntityLoader: DataLoader<string, NpsSurvey>;
}

const modelLoadersToGenerate = [
  ['account', Account],
  ['accountUser', AccountUser],
  ['audience', Audience],
  ['branchingPath', BranchingPath],
  ['customAttribute', CustomAttribute],
  ['customAttributeValue', CustomAttributeValue],
  ['customApiEvent', CustomApiEvent],
  ['guide', Guide],
  ['guideBase', GuideBase],
  ['guideData', GuideData],
  ['guideBaseStepCta', GuideBaseStepCta],
  [
    'guideBaseStepAutoCompleteInteraction',
    GuideBaseStepAutoCompleteInteraction,
  ],
  ['guideModule', GuideModule],
  ['guideModuleBase', GuideModuleBase],
  ['guideParticipant', GuideParticipant],
  ['guideStepBase', GuideStepBase],
  ['inputStepAnswer', InputStepAnswer],
  ['inputStepBase', InputStepBase],
  ['inputStepPrototype', InputStepPrototype],
  ['media', Media],
  ['mediaReference', MediaReference],
  ['module', Module],
  ['moduleStepPrototype', ModuleStepPrototype],
  ['organization', Organization],
  ['organizationSettings', OrganizationSettings],
  ['organizationData', OrganizationData],
  ['organizationInlineEmbed', OrganizationInlineEmbed],
  ['segmentApiKey', SegmentApiKey],
  ['integrationApiKey', IntegrationApiKey],
  ['step', Step],
  ['stepEventMapping', StepEventMapping],
  ['stepAutoCompleteInteraction', StepAutoCompleteInteraction],
  ['stepEventMappingRule', StepEventMappingRule],
  ['stepPrototype', StepPrototype],
  ['stepPrototypeCta', StepPrototypeCta],
  [
    'stepPrototypeAutoCompleteInteraction',
    StepPrototypeAutoCompleteInteraction,
  ],
  ['stepPrototypeTaggedElement', StepPrototypeTaggedElement],
  ['stepTaggedElement', StepTaggedElement],
  ['template', Template],
  ['templateTarget', TemplateTarget],
  ['templateAutoLaunchRule', TemplateAutoLaunchRule],
  ['templateAudience', TemplateAudience],
  ['templateModule', TemplateModule],
  ['triggeredBranchingPath', TriggeredBranchingPath],
  ['userAuth', UserAuth],
  ['user', User],
  ['userOrganization', UserOrganization],
  ['webhook', Webhook],
  ['npsSurvey', NpsSurvey],
];

async function sortedFindAll(
  Model: any,
  key: 'id' | 'entityId',
  ids: (number | string)[]
): Promise<any[]> {
  const rows = await Model.findAll({ where: { [key]: ids } });
  const idHash = keyBy(rows, key);
  return ids.map((id) => idHash[id]);
}

function genLoaderPairFactory(Model) {
  return () => {
    const idLoader = new DataLoader(async (ids) => {
      const results = await sortedFindAll(Model, 'id', ids as number[]);

      results.forEach((result: any) => {
        result && entityLoader.prime(result.entityId, result);
      });

      return results;
    });

    const entityLoader = new DataLoader<string, any>(async (entityIds) => {
      const results = await sortedFindAll(
        Model,
        'entityId',
        entityIds as string[]
      );

      results.forEach((result: any | undefined) => {
        result && idLoader.prime(result.id, result);
      });

      return results;
    });

    return [idLoader, entityLoader];
  };
}

const modelLoaderFactories = Object.fromEntries(
  modelLoadersToGenerate.flatMap(([name, Model]) => {
    const loaderFactory = genLoaderPairFactory(Model);
    return [
      [
        `${name as string}Loader`,
        {
          factory: loaderFactory,
          index: 0,
          other: `${name as string}EntityLoader`,
        },
      ],
      [
        `${name as string}EntityLoader`,
        {
          factory: loaderFactory,
          index: 1,
          other: `${name as string}Loader`,
        },
      ],
    ];
  })
) as Record<
  keyof ModelLoaders,
  {
    factory: () => [DataLoader<number, any>, DataLoader<string, any>];
    index: 0 | 1;
    other: string;
  }
>;

export default modelLoaderFactories;
