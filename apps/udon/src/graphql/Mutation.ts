import { GraphQLObjectType } from 'graphql';
import deleteUser from 'src/graphql/User/mutations/deleteUser.mutation';
import inviteUsers from 'src/graphql/User/mutations/inviteUsers.mutation';
import modifyUserExtras from 'src/graphql/User/mutations/modifyUserExtras.mutation';
import unarchiveAccount from 'src/graphql/Account/mutations/unarchiveAccount.mutation';
import archiveAccount from 'src/graphql/Account/mutations/archiveAccount.mutation';
import manageBlockedAccount from './Account/mutations/manageBlockedAccount.mutation';
import assignPrimaryContactToAccount from 'src/graphql/Account/mutations/assignPrimaryContactToAccount.mutation';
import unassignPrimaryContactFromAccount from 'src/graphql/Account/mutations/unassignPrimaryContactFromAccount.mutation';
import createGuideBase from 'src/graphql/GuideBase/mutations/createGuideBase';
import editGuideBase from 'src/graphql/GuideBase/mutations/editGuideBase';
import launchGuideBase from 'src/graphql/GuideBase/mutations/launchGuideBase';
import pauseGuideBase from 'src/graphql/GuideBase/mutations/pauseGuideBase';
import unpauseGuideBase from 'src/graphql/GuideBase/mutations/unpauseGuideBase';
import deleteGuideBase from 'src/graphql/GuideBase/mutations/deleteGuideBase';
import deleteGuideBasesForAccount from './GuideBase/mutations/deleteGuideBasesForAccount';
import setUISettings from 'src/graphql/Organization/mutations/setUISettings';
import setOrgSettings from 'src/graphql/Organization/mutations/setOrgSettings';
import editStep from 'src/graphql/Step/mutations/editStep';
import setStepCompletion from 'src/graphql/Step/mutations/setStepCompletion';
import createModule from 'src/graphql/Module/mutations/createModule';
import deleteModule from 'src/graphql/Module/mutations/deleteModule';
import editModule from 'src/graphql/Module/mutations/editModule';
import editModuleDetails from 'src/graphql/Module/mutations/editModuleDetails';
import duplicateModule from 'src/graphql/Module/mutations/duplicateModule';
import duplicateTemplate from 'src/graphql/Template/mutations/duplicateTemplate';
import createTemplate from 'src/graphql/Template/mutations/createTemplate';
import deleteTemplate from 'src/graphql/Template/mutations/deleteTemplate';
import editTemplate from 'src/graphql/Template/mutations/editTemplate';
import editTemplateLocation from 'src/graphql/Template/mutations/editTemplateLocation';
import bootstrapTemplates from './Template/mutations/bootstrapTemplates';
import removeTemplate from 'src/graphql/Template/mutations/removeTemplate';
import createSplitTestTemplate from 'src/graphql/Template/mutations/createSplitTestTemplate';
import editSplitTestTemplate from './Template/mutations/editSplitTestTemplate';
import setAutoLaunchRulesAndTargetsForTemplate from 'src/graphql/Template/mutations/setAutoLaunchRulesAndTargetsForTemplate';
import saveNewAudience from 'src/graphql/Audience/mutations/saveNewAudience';
import deleteAudience from 'src/graphql/Audience/mutations/deleteAudience';
import editAudience from 'src/graphql/Audience/mutations/editAudience';
import duplicateAudience from './Audience/mutations/duplicateAudience';
import deleteAttribute from 'src/graphql/Attribute/mutations/deleteAttribute';
import setStepAutoCompleteMapping from 'src/graphql/StepEventMapping/mutations/setStepAutoCompleteMapping';
import generateBentoApiKey from 'src/graphql/SegmentApiKey/mutations/generateBentoApiKey';
import deleteBentoApiKey from 'src/graphql/SegmentApiKey/mutations/deleteBentoApiKey';
import setIntegrationApiKey from 'src/graphql/IntegrationApiKey/mutations/setIntegrationApiKey';
import deleteIntegrationApiKey from 'src/graphql/IntegrationApiKey/mutations/deleteIntegrationApiKey';
import setWebhook from 'src/graphql/Webhook/mutations/setWebhook';
import testWebhook from 'src/graphql/Webhook/mutations/testWebhook';
import configureZendesk from 'src/graphql/IntegrationApiKey/mutations/configureZendesk';
import testAutolaunchRules from 'src/graphql/Template/mutations/testAutolaunchRules';
import resetGuideBasesForAccount from './Account/mutations/resetGuideBasesForAccount.mutation';
import createInlineEmbed from './InlineEmbed/mutations/createInlineEmbed';
import editInlineEmbed from './InlineEmbed/mutations/editInlineEmbed';
import deleteInlineEmbed from './InlineEmbed/mutations/deleteInlineEmbed';
import qaRequest from './QATools/qaRequest.mutation';
import setZendeskLiveChat from './IntegrationApiKey/mutations/setZendeskLiveChat';
import setZendeskOption from './IntegrationApiKey/mutations/setZendeskOption';
import arrayToCsvReport from './analytics/mutations/arrayToCsvReport.graphql';
import { GraphQLContext } from './types';
import createNpsSurvey from './NpsSurvey/mutations/createNpsSurvey';
import editNpsSurvey from './NpsSurvey/mutations/editNpsSurvey';
import launchNpsSurvey from './NpsSurvey/mutations/launchNpsSurvey';
import pauseNpsSurvey from './NpsSurvey/mutations/pauseNpsSurvey';
import setPriorityRankings from './RankableObject/setPriorityRankings';
import deleteNpsSurvey from 'src/graphql/NpsSurvey/mutations/deleteNpsSurvey';
import resetTemplate from 'src/graphql/Template/mutations/resetTemplate';
import deleteTemplates from 'src/graphql/Template/mutations/deleteTemplates';
import removeTemplates from 'src/graphql/Template/mutations/removeTemplates';
import resetTemplates from 'src/graphql/Template/mutations/resetTemplates';
import resetGuideBase from 'src/graphql/GuideBase/mutations/resetGuideBase';
import editTemplateSettings from 'src/graphql/Template/mutations/editTemplateSettings';
import createVisualBuilderSession from 'src/graphql/VisualBuilderSession/mutations/createVisualBuilderSession';
import updateVisualBuilderSession from 'src/graphql/VisualBuilderSession/mutations/updateVisualBuilderSession';

export default new GraphQLObjectType<unknown, GraphQLContext>({
  name: 'Mutation',
  fields: {
    deleteUser,
    inviteUsers,
    modifyUserExtras,
    archiveAccount,
    unarchiveAccount,
    editTemplateSettings,
    manageBlockedAccount,
    assignPrimaryContactToAccount,
    unassignPrimaryContactFromAccount,
    createGuideBase,
    generateBentoApiKey,
    arrayToCsvReport,
    deleteBentoApiKey,
    setIntegrationApiKey,
    deleteIntegrationApiKey,
    editGuideBase,
    deleteGuideBase,
    deleteGuideBasesForAccount,
    deleteAudience,
    duplicateAudience,
    launchGuideBase,
    pauseGuideBase,
    setZendeskLiveChat,
    setZendeskOption,
    unpauseGuideBase,
    setUISettings,
    setOrgSettings,
    editStep,
    setStepCompletion,
    createModule,
    deleteModule,
    editModule,
    editAudience,
    editModuleDetails,
    duplicateModule,
    duplicateTemplate,
    createTemplate,
    createSplitTestTemplate,
    deleteTemplate,
    editTemplate,
    editTemplateLocation,
    editSplitTestTemplate,
    bootstrapTemplates,
    removeTemplate,
    setAutoLaunchRulesAndTargetsForTemplate,
    saveNewAudience,
    setStepAutoCompleteMapping,
    setWebhook,
    testWebhook,
    configureZendesk,
    testAutolaunchRules,
    resetGuideBasesForAccount,
    createInlineEmbed,
    editInlineEmbed,
    deleteInlineEmbed,
    deleteAttribute,
    qaRequest,
    createNpsSurvey,
    editNpsSurvey,
    launchNpsSurvey,
    pauseNpsSurvey,
    setPriorityRankings,
    deleteNpsSurvey,
    resetTemplate,
    deleteTemplates,
    removeTemplates,
    resetTemplates,
    resetGuideBase,
    createVisualBuilderSession,
    updateVisualBuilderSession,
  },
});
