import modelLoaderFactories, { ModelLoaders } from './modelLoaders';

import accountsAssignedToUserLoader from './Account/accountsAssignedToUser.loader';
import accountsOfOrganizationLoader from './Account/accountsOfOrganization.loader';
import accountsOfOrganizationCountLoader from './Account/accountsOfOrganizationCount.loader';
import accountsUsingTemplateLoader from './Account/accountsUsingTemplate.loader';
import accountUsersOfAccountLoader from './AccountUser/accountUsersOfAccount.loader';
import accountsBlockedByLoader from './Account/accountsBlockedBy.loader';
import activeAccountGuidesOfAccountCountLoader from './Guide/activeAccountGuidesOfAccountCount.loader';
import allInlineEmbedsLoader from './InlineEmbed/allInlineEmbeds.loader';
import attributesOfOrganizationLoader from './Attribute/attributesOfOrganization.loader';
import availableGuideForAccountUserLoader from 'src/data/loaders/Guide/availableGuideForAccountUser.loader';
import availableGuidesForAccountUserLoader from './Guide/availableGuidesForAccountUser.loader';
import averageCompletionPercentageOfGuideBaseLoader from './GuideBase/averageCompletionPercentageOfGuideBase.loader';
import bodyOfStepLoader from './Step/bodyOfStep.loader';
import bodySlateOfStepLoader from './Step/bodySlateOfStep.loader';
import nameOfGuideStepBaseLoader from './GuideStepBase/nameOfGuideStepBase.loader';
import bodyOfGuideStepBaseLoader from './GuideStepBase/bodyOfGuideStepBase.loader';
import bodySlateOfGuideStepBaseLoader from './GuideStepBase/bodySlateOfGuideStepBase.loader';
import branchedFromGuideLoader from './BranchingPath/branchedFromGuide.loader';
import branchingOfStepLoader from './Step/branchingOfStep.loader';
import branchingPathsOfStepLoader from './Step/branchingPathsOfStep.loaders';
import branchedFromChoiceOfGuideLoader from './Guide/branchedFromChoiceOfGuide.loader';
import branchingModulesOfTemplateLoader from './Module/branchingModulesOfTemplate.loader';
import countParticipantsOfGuideModuleBaseLoader from './GuideModuleBase/countParticipantsOfGuideModuleBase.loader';
import countParticipantsWhoViewedGuideModuleBaseLoader from './GuideModuleBase/countParticipantsWhoViewedGuideModuleBase.loader';
import countStepsCompletedOfGuideBaseLoader from './Step/countStepsCompletedOfGuideBase.loaders';
import countUsersViewedGuideBaseLoader from './GuideBase/countUsersViewedGuideBase.loader';
import countUsersViewedGuidesOfAccountLoader from './GuideBase/countUsersViewedGuidesOfAccount.loader';
import countUsersViewedGuideStepBaseLoader from './GuideStepBase/countUsersViewedGuideStepBase.loader';
import countUsersViewedStepLoader from './Step/countUsersViewedStep.loader';
import ctasClickedOfGuideBaseLoader from './GuideBase/ctasClickedOfGuideBase.loader';
import dynamicModulesOfTemplateLoader from './Module/dynamicModulesOfTemplate.loader';
import featureFlagsForOrganizationLoader from 'src/data/loaders/FeatureFlags/featureFlagsForOrganization.loader';
import firstIncompleteStepOfGuideLoader from './Step/firstIncompleteStepOfGuide.loader';
import googleDriveUploaderAuthLoader from './FileUpload/googleDriveUploaderAuth.loader';
import guideBasesCountOfAccountLoader from './GuideBase/guideBasesCountOfAccount.loader';
import guideBasesOfAccountLoader from './GuideBase/guideBasesOfAccount.loader';
import guideBasesOfAccountAndTemplateLoader from './GuideBase/guideBasesOfAccountAndTemplate.loader';
import guideBasesOfOrganizationLoader from './GuideBase/guideBasesOfOrganization.loader';
import guideBasesOfOrganizationCountLoader from './GuideBase/guideBasesOfOrganizationCount.loader';
import guideBasesOfTemplateLoader from './GuideBase/guideBasesOfTemplate';
import guideBaseStepAutoCompleteInteractionsOfGuideStepBaseLoader from './StepAutoCompleteInteraction/guideBaseStepAutoCompleteInteractionsOfGuideStepBase.loader';
import guideBaseStepCtasOfGuideStepBaseLoader from './StepCta/guideBaseStepCtasOfGuideStepBase.loader';
import guideForInlineEmbedLoader from './Guide/guideForInlineEmbed.loader';
import guideInlineEmbedLoader from './InlineEmbed/guideInlineEmbed.loader';
import guideModuleOfStepLoader from './GuideModule/guideModuleOfStep.loader';
import guideOfStepLoader from './Guide/guideOfStep.loader';
import guideParticipantForGuideAndAccountUserLoader from './Guide/guideParticipantForGuideAndAccountUser.loader';
import guidesCreatedFromGuideBaseLoader from './Guide/guidesCreatedFromGuideBase.loader';
import guidesOfAccountLoader from './Guide/guidesOfAccount.loader';
import guidesForAccountUser from './Guide/guidesForAccountUser.loader';
import guideDataOfTemplate from './GuideBase/guideDataOfTemplate.loader';
import guideStepBasesOfGuideModuleBaseLoader from './GuideStepBase/guideStepBasesOfGuideModuleBase.loader';
import stepTypesInGuideModuleBaseLoader from './GuideModuleBase/stepTypesInGuideModuleBase.loader';
import branchingInfoOfGuideStepBaseLoader from './GuideStepBase/branchingInfoOfGuideStepBase.loader';
import hasActiveGuideBasesLoader from './Template/hasActiveGuideBases.loader';
import hasGuideBasesLoader from './Template/hasGuideBases.loader';
import hasAutoLaunchedGuideBasesLoader from './Template/hasAutoLaunchedGuideBases.loader';
import manuallyLaunchedAccountsLoader from './Template/manuallyLaunchedAccounts.loader';
import inlineEmbedsForAccountUserLoader from './InlineEmbed/inlineEmbedsForAccountUser.loader';
import integrationsForAccountUserLoader from './IntegrationApiKey/integrationsForAccountUser.loader';
import inlineEmbedsWithGuideForAccountUserLoader from 'src/data/loaders/InlineEmbed/inlineEmbedsWithGuideForAccountUser.loader';
import inputBasesOfGuideStepBaseLoader from './InputStep/inputBasesOfGuideStepBase.loader';
import inputPrototypesOfStepPrototypeLoader from './InputStep/inputPrototypesOfStepPrototype.loader';
import inputStepAnswerOfStepForEmbeddableLoader from './InputStep/inputStepAnswerOfStepForEmbeddable.loader';
import inputStepAnswersOfTemplateLoader from './InputStepAnswer/inputStepAnswersOfTemplate.loader';
import inputStepAnswersCountOfTemplateLoader from './InputStepAnswer/inputStepAnswersOfTemplateCount.loader';
import inputStepPrototypesOfTemplateCountLoader from './InputStepPrototype/inputStepPrototypesCountOfTemplate.loader';
import inputStepPrototypesOfTemplateLoader from './InputStepPrototype/inputStepPrototypesOfTemplate.loader';
import lastActiveAtOfGuideBaseLoader from './GuideBase/lastActiveAtOfGuideBase.loader';
import lastCompletedStepOfGuideBaseLoader from './Step/lastCompletedStepOfGuideBase.loader';
import lastCompletedStepOfGuideLoader from './Step/lastCompletedStepOfGuide.loader';
import lastIncompleteGuideModuleOfGuideLoader from './GuideModule/lastIncompleteGuideModuleOfGuide.loader';
import lastViewedGuideOfAccountUserLoader from './Guide/lastViewedGuideOfAccountUser.loader';
import mediaReferencesOfStepPrototypeLoader from './Media/mediaReferencesOfStepPrototype.loader';
import moduleOfStepPrototypeLoader from './Module/moduleOfStepPrototype.loader';
import modulesOfTemplateLoader from './Module/modulesOfTemplate.loader';
import modulesOfGuideLoader from './GuideModule/modulesOfGuide.loader';
import nameOfGuideModuleLoader from './GuideModule/nameOfGuideModule.loader';
import nameOfGuideModuleBaseLoader from './GuideModuleBase/nameOfGuideModuleBase.loader';
import nameOfStepLoader from './Step/nameOfStep.loader';
import numberOfAccountsWithUnmodifiedGuidesConnectedToModuleLoader from './Module/numberOfAccountsWithUnmodifiedGuidesConnectedToModule.loader';
import numberOfAccountsWithUnmodifiedGuidesConnectedToTemplateLoader from './Template/numberOfAccountsWithUnmodifiedGuidesConnectedToTemplate.loader';
import numberGuidesOfTemplate from './Guide/numberGuidesOfTemplate.loader';
import npsParticipantForAccountUserLoader from './NpsSurvey/npsParticipantForAccountUser.loader';
import npsSurveyOfParticipantLoader from './NpsSurvey/npsSurveyOfParticipant.loader';
import onboardingInlineEmbedsLoader from 'src/data/loaders/InlineEmbed/onboardingInlineEmbeds.loader';
import organizationHasIntegrationsLoader from './Organization/organizationHasIntegrations.loader';
import organizationSettingsOfOrganizationLoader from 'src/data/loaders/Organization/organizationSettingsOfOrganization.loader';
import organizationDataOfOrganizationLoader from 'src/data/loaders/Organization/organizationDataOfOrganization.loader';
import organizationStepPrototypeAutoCompleteInteractionsLoader from './StepAutoCompleteInteraction/organizationStepPrototypeAutoCompleteInteractions.loader';
import organizationTaggedElementsLoader from 'src/data/loaders/TaggedElements/organizationTaggedElements.loader';
import participantsOfGuideBaseLoader from './AccountUser/participantsOfGuideBase.loader';
import participantsOfGuideLoader from './AccountUser/participantsOfGuide.loader';
import participantsOfGuideModuleBaseLoader from './GuideModuleBase/participantsOfGuideModuleBase.loader';
import participantsWhoViewedGuideBaseLoader from './AccountUser/participantsWhoViewedGuideBase.loader';
import participantsWhoViewedGuideModuleBaseLoader from './GuideModuleBase/participantsWhoViewedGuideModuleBase.loader';
import stepAutoCompleteInteractionsForEmbeddableLoader from './StepAutoCompleteInteraction/stepAutoCompleteInteractionsForEmbeddable.loader';
import stepAutoCompleteInteractionsOfStepLoader from './StepAutoCompleteInteraction/stepAutoCompleteInteractionsOfStep.loader';
import stepByWhichGuideModuleBaseDynamicallyAddedLoader from './Step/stepByWhichGuideModuleBaseDynamicallyAdded.loader';
import stepEventMappingRulesOfStepEventMappingLoader from './StepEventMappingRule/stepEventMappingRulesOfStepEventMapping.loader';
import stepEventMappingsOfStepLoader from './StepEventMapping/stepEventMappingsOfStep.loader';
import stepEventMappingsOfStepPrototypeLoader from './StepEventMapping/stepEventMappingsOfStepPrototype.loader';
import stepParticipantForStepAndAccountUserLoader from './Step/stepParticipantForStepAndAccountUser.loader';
import stepPrototypeAutoCompleteInteractionsOfStepPrototypeLoader from './StepAutoCompleteInteraction/stepPrototypeAutoCompleteInteractionsOfStepPrototype.loader';
import stepPrototypeAutoCompleteInteractionOfStepInteractionLoader from './StepAutoCompleteInteraction/stepPrototypeAutoCompleteInteractionOfStepInteraction.loader';
import stepPrototypeCtasOfStepPrototypeLoader from './StepCta/stepPrototypeCtasOfStepPrototype.loader';
import stepPrototypesOfModuleLoader from './StepPrototype/stepPrototypesOfModule.loader';
import stepPrototypesOfTemplateLoader from './StepPrototype/stepPrototypesOfTemplate.loader';
import stepPrototypeTaggedElementsLoader from 'src/data/loaders/TaggedElements/stepPrototypeTaggedElements.loader';
import stepPrototypeTaggedElementOfStepTaggedElementLoader from 'src/data/loaders/TaggedElements/stepPrototypeTaggedElementOfStepTaggedElement.loader';
import templateOfStepTaggedElementLoader from 'src/data/loaders/TaggedElements/templateOfStepTaggedElement.loader';
import stepCompletionOfStepPrototypesLoader from './StepPrototype/stepCompletionOfStepPrototype.loader';
import titleOfStepTaggedElementLoader from './TaggedElements/titleOfStepTaggedElement.loader';
import stepsOfGuideLoader from './Step/stepsOfGuide.loader';
import stepsOfGuideModuleLoader from './Step/stepsOfGuideModule.loader';
import stepsOfGuideStepBaseLoader from './Step/stepsOfGuideStepBase.loader';
import stepTaggedElementParticipantForTagAndAccountUserLoader from './TaggedElements/stepTaggedElementParticipantForTagAndAccountUser.loader';
import stepTaggedElementsLoader from 'src/data/loaders/TaggedElements/stepTaggedElements.loader';
import templateAutoLaunchRulesOfTemplateLoader from './TemplateAutoLaunchRule/templateAutoLaunchRulesOfTemplate.loader';
import templateInlineEmbedLoader from './InlineEmbed/templateInlineEmbed.loader';
import inlineEmbedOfTemplateLoader from './InlineEmbed/inlineEmbedOfTemplate.loader';
import templateParticipantCountLoader from './Template/participantCount.loader';
import templateStatsLoader from './Template/templateStats.loader';
import templatesUsingModuleDynamicallyLoader from './Template/templatesUsingModuleDynamically.loader';
import templatesUsingModuleLoader from './Template/templatesUsingModule.loader';
import templatesUsingStepPrototypeLoader from './Template/templatesUsingStepPrototype.loader';
import templateTargetsOfTemplateLoader from './TemplateTarget/templateTargetsOfTemplate.loader';
import templateAudiencesOfTemplateLoader from './TemplateAudience/templateAudiencesOfTemplate.loader';
import templatesOfAudienceLoader from './TemplateAudience/templatesOfAudience.loader';
import templateUsageLoader from './Template/templateUsage.loader';
import splitTestHasBeenLaunchedLoader from './Template/splitTestHasBeenLaunched.loader';
import templateTargetedBySplitTestingLoader from './Template/templateTargetedBySplitTesting.loader';
import templateSplitSourcesLoader from './Template/templateSplitSources.loader';
import templateSplitTargetsLoader from './Template/templateSplitTargets.loader';
import templatesLaunchingTemplateLoader from './Template/templatesLaunchingTemplate.loader';
import triggeredCountOfBranchingPathLoader from './BranchingPath/triggeredCountOfBranchingPath.loader';
import userAuthLoader from './User/userAuths.loader';
import userBentoOnboardingGuideLoader from './User/userBentoOnboardingGuide.loader';
import usersCompletedAStepInGuideBaseLoader from './GuideBase/usersCompletedAStepInGuideBase.loader';
import usersCompletedGuideStepBaseLoader from './GuideStepBase/usersCompletedGuideStepBase.loader';
import usersSavedForLaterOfGuideBaseLoader from './GuideBase/usersSavedForLaterOfGuideBase.loader';
import usersSkippedAStepInGuideBaseLoader from './GuideBase/usersSkippedAStepInGuideBase.loader';
import usersSkippedStepLoader from './Step/usersSkippedStep.loader';
import usersViewedAStepInGuideBaseLoader from './GuideBase/usersViewedAStepInGuideBase.loader';
import usersViewedGuideStepBaseLoader from './GuideStepBase/usersViewedGuideStepBase.loader';
import usersViewedStepLoader from './Step/usersViewedStep.loader';
import taggedElementsOfGuideLoader from './TaggedElements/taggedElementsOfGuide.loader';
import stepPrototypeTaggedElementsOfStepPrototypeLoader from './TaggedElements/stepPrototypeTaggedElementsOfStepPrototype.loader';
import stepPrototypeTaggedElementsOfStepPrototypeAndTemplateLoader from './TaggedElements/stepPrototypeTaggedElementsOfStepPrototypeAndTemplate.loader';
import npsSurveysOfOrganizationLoader from './NpsSurvey/npsSurveysOfOrganization.loader';
import totalAnswersOfNpsSurveyLoader from './NpsSurvey/totalAnswersOfNpsSurvey.loader';
import lastLaunchedAtOfNpsSurveyLoader from './NpsSurvey/lastLaunchedAtOfNpsSurvey.loader';
import npsSurveyInstancesOfNpsSurveyLoader from './NpsSurveyInstance/npsSurveyInstancesOfNpsSurvey.loader';
import launchedNpsSurveysOfOrganizationLoader from './NpsSurvey/launchedNpsSurveysOfOrganization.loader';
import npsParticipantsOfNpsSurveyInstanceLoader from './NpsParticipant/npsParticipantsOfNpsSurveyInstance.loader';
import accountUserOfNpsParticipantLoader from './AccountUser/accountUserOfNpsParticipant.loader';
import totalViewsOfNpsSurveyLoader from './NpsSurvey/totalViewsOfNpsSurvey.loader';
import orderIndexOfGuideLoader from './Guide/orderIndexOfGuide.loader';
import orderIndexOfNpsParticipantLoader from './NpsSurvey/orderIndexOfNpsParticipant.loader';
import npsScoreBreakdownOfNpsSurveyLoader from './NpsSurvey/npsScoreBreakdownOfNpsSurvey.loader';
import stepPrototypeTaggedElementsOfTemplateLoader from './TaggedElements/stepPrototypeTaggedElementsOfTemplate.loader';
import stepAutoCompleteInteractionsForGuideLoader from './StepAutoCompleteInteraction/stepAutoCompleteInteractionsForGuide.loader';

export interface Loaders extends ModelLoaders, InitializedCustomLoaders {
  reset: () => void;
}

type InitializedCustomLoaders = {
  [key in keyof typeof customLoaderMakers]: ReturnType<
    (typeof customLoaderMakers)[key]
  >;
};

const customLoaderMakers = {
  accountsAssignedToUserLoader,
  accountsOfOrganizationLoader,
  accountsOfOrganizationCountLoader,
  accountsUsingTemplateLoader,
  accountUsersOfAccountLoader,
  accountsBlockedByLoader,
  activeAccountGuidesOfAccountCountLoader,
  allInlineEmbedsLoader,
  attributesOfOrganizationLoader,
  availableGuideForAccountUserLoader,
  availableGuidesForAccountUserLoader,
  averageCompletionPercentageOfGuideBaseLoader,
  bodyOfStepLoader,
  bodySlateOfStepLoader,
  nameOfGuideStepBaseLoader,
  bodyOfGuideStepBaseLoader,
  bodySlateOfGuideStepBaseLoader,
  branchedFromGuideLoader,
  branchingOfStepLoader,
  branchingPathsOfStepLoader,
  branchedFromChoiceOfGuideLoader,
  branchingModulesOfTemplateLoader,
  countParticipantsOfGuideModuleBaseLoader,
  countParticipantsWhoViewedGuideModuleBaseLoader,
  countStepsCompletedOfGuideBaseLoader,
  countUsersViewedGuideBaseLoader,
  countUsersViewedGuidesOfAccountLoader,
  countUsersViewedGuideStepBaseLoader,
  countUsersViewedStepLoader,
  ctasClickedOfGuideBaseLoader,
  dynamicModulesOfTemplateLoader,
  featureFlagsForOrganizationLoader,
  firstIncompleteStepOfGuideLoader,
  googleDriveUploaderAuthLoader,
  guideBasesCountOfAccountLoader,
  guideBasesOfAccountLoader,
  guideBasesOfAccountAndTemplateLoader,
  guideBasesOfOrganizationLoader,
  guideBasesOfOrganizationCountLoader,
  guideBasesOfTemplateLoader,
  guideBaseStepAutoCompleteInteractionsOfGuideStepBaseLoader,
  guideBaseStepCtasOfGuideStepBaseLoader,
  guideDataOfTemplate,
  guideForInlineEmbedLoader,
  guideInlineEmbedLoader,
  guideModuleOfStepLoader,
  guideOfStepLoader,
  guideParticipantForGuideAndAccountUserLoader,
  guidesCreatedFromGuideBaseLoader,
  guidesOfAccountLoader,
  guidesForAccountUser,
  guideStepBasesOfGuideModuleBaseLoader,
  stepTypesInGuideModuleBaseLoader,
  branchingInfoOfGuideStepBaseLoader,
  hasActiveGuideBasesLoader,
  hasGuideBasesLoader,
  hasAutoLaunchedGuideBasesLoader,
  manuallyLaunchedAccountsLoader,
  inlineEmbedsForAccountUserLoader,
  integrationsForAccountUserLoader,
  inlineEmbedsWithGuideForAccountUserLoader,
  inputBasesOfGuideStepBaseLoader,
  inputPrototypesOfStepPrototypeLoader,
  inputStepAnswerOfStepForEmbeddableLoader,
  inputStepAnswersOfTemplateLoader,
  inputStepAnswersCountOfTemplateLoader,
  inputStepPrototypesOfTemplateLoader,
  inputStepPrototypesOfTemplateCountLoader,
  lastActiveAtOfGuideBaseLoader,
  lastCompletedStepOfGuideBaseLoader,
  lastCompletedStepOfGuideLoader,
  lastIncompleteGuideModuleOfGuideLoader,
  lastViewedGuideOfAccountUserLoader,
  mediaReferencesOfStepPrototypeLoader,
  moduleOfStepPrototypeLoader,
  modulesOfGuideLoader,
  nameOfGuideModuleLoader,
  nameOfGuideModuleBaseLoader,
  nameOfStepLoader,
  modulesOfTemplateLoader,
  numberOfAccountsWithUnmodifiedGuidesConnectedToModuleLoader,
  numberOfAccountsWithUnmodifiedGuidesConnectedToTemplateLoader,
  numberGuidesOfTemplate,
  npsParticipantForAccountUserLoader,
  npsSurveyOfParticipantLoader,
  onboardingInlineEmbedsLoader,
  organizationHasIntegrationsLoader,
  organizationSettingsOfOrganizationLoader,
  organizationDataOfOrganizationLoader,
  organizationStepPrototypeAutoCompleteInteractionsLoader,
  organizationTaggedElementsLoader,
  participantsOfGuideBaseLoader,
  participantsOfGuideLoader,
  participantsOfGuideModuleBaseLoader,
  participantsWhoViewedGuideBaseLoader,
  participantsWhoViewedGuideModuleBaseLoader,
  stepAutoCompleteInteractionsForEmbeddableLoader,
  stepAutoCompleteInteractionsOfStepLoader,
  stepAutoCompleteInteractionsForGuideLoader,
  stepByWhichGuideModuleBaseDynamicallyAddedLoader,
  stepEventMappingRulesOfStepEventMappingLoader,
  stepEventMappingsOfStepLoader,
  stepEventMappingsOfStepPrototypeLoader,
  stepParticipantForStepAndAccountUserLoader,
  stepPrototypeAutoCompleteInteractionsOfStepPrototypeLoader,
  stepPrototypeAutoCompleteInteractionOfStepInteractionLoader,
  stepPrototypeCtasOfStepPrototypeLoader,
  stepPrototypesOfModuleLoader,
  stepPrototypesOfTemplateLoader,
  stepPrototypeTaggedElementsLoader,
  stepPrototypeTaggedElementOfStepTaggedElementLoader,
  stepPrototypeTaggedElementsOfTemplateLoader,
  templateOfStepTaggedElementLoader,
  stepCompletionOfStepPrototypesLoader,
  titleOfStepTaggedElementLoader,
  stepsOfGuideLoader,
  stepsOfGuideModuleLoader,
  stepsOfGuideStepBaseLoader,
  stepTaggedElementParticipantForTagAndAccountUserLoader,
  stepTaggedElementsLoader,
  taggedElementsOfGuideLoader,
  templateAutoLaunchRulesOfTemplateLoader,
  templateAudiencesOfTemplateLoader,
  templatesOfAudienceLoader,
  templateInlineEmbedLoader,
  inlineEmbedOfTemplateLoader,
  templateParticipantCountLoader,
  templateStatsLoader,
  templatesUsingModuleDynamicallyLoader,
  templatesUsingModuleLoader,
  templatesUsingStepPrototypeLoader,
  templateTargetsOfTemplateLoader,
  templateUsageLoader,
  splitTestHasBeenLaunchedLoader,
  templateTargetedBySplitTestingLoader,
  templatesLaunchingTemplateLoader,
  templateSplitSourcesLoader,
  templateSplitTargetsLoader,
  triggeredCountOfBranchingPathLoader,
  userAuthLoader,
  userBentoOnboardingGuideLoader,
  usersCompletedAStepInGuideBaseLoader,
  usersCompletedGuideStepBaseLoader,
  usersSavedForLaterOfGuideBaseLoader,
  usersSkippedAStepInGuideBaseLoader,
  usersSkippedStepLoader,
  usersViewedAStepInGuideBaseLoader,
  usersViewedGuideStepBaseLoader,
  usersViewedStepLoader,
  stepPrototypeTaggedElementsOfStepPrototypeLoader,
  stepPrototypeTaggedElementsOfStepPrototypeAndTemplateLoader,
  npsSurveysOfOrganizationLoader,
  launchedNpsSurveysOfOrganizationLoader,
  totalAnswersOfNpsSurveyLoader,
  lastLaunchedAtOfNpsSurveyLoader,
  npsSurveyInstancesOfNpsSurveyLoader,
  npsParticipantsOfNpsSurveyInstanceLoader,
  accountUserOfNpsParticipantLoader,
  totalViewsOfNpsSurveyLoader,
  orderIndexOfGuideLoader,
  orderIndexOfNpsParticipantLoader,
  npsScoreBreakdownOfNpsSurveyLoader,
};

function genLoaders(): Loaders {
  const generatedLoaders: string[] = [];
  const loaders = {
    reset() {
      for (const loader of generatedLoaders) {
        this[loader].clearAll();
        delete this[loader];
      }
      generatedLoaders.splice(0, generatedLoaders.length);
    },
  } as Loaders;

  /**
   * Because we have so many loaders it can lead to heap allocation issues if
   * all of them are created on each request and since in most cases only a few
   * of the loaders are needed for each request we can just create the ones we
   * need on the fly and save a ton of extra memory usage.
   */
  const loadersProxy = new Proxy(loaders, {
    get(target, prop) {
      if (!target[prop]) {
        if (customLoaderMakers[prop]) {
          // need to pass in the proxy so loader creation is recursive
          target[prop] = customLoaderMakers[prop](loadersProxy);
          generatedLoaders.push(prop as string);
        } else if (modelLoaderFactories[prop]) {
          const { factory, index, other } = modelLoaderFactories[prop];
          // need to pass in the proxy so loader creation is recursive
          const [idLoader, entityLoader] = factory(loadersProxy);
          target[prop] = index === 0 ? idLoader : entityLoader;
          target[other] = index === 0 ? entityLoader : idLoader;
          generatedLoaders.push(prop as string, other);
        } else {
          throw new Error(`No loader factory for ${prop.toString()}`);
        }
      }
      return target[prop];
    },
  });

  return loadersProxy;
}

export default genLoaders;
