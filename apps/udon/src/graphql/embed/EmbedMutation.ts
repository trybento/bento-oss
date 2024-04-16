import { GraphQLObjectType } from 'graphql';

import { EmbedContext } from '../types';
import trackGuideView from 'src/graphql/embed/EmbedGuide/mutations/trackGuideView';
import resetOnboarding from 'src/graphql/embed/EmbedGuide/mutations/resetOnboarding.mutation';
import setStepCompletion from 'src/graphql/embed/EmbedStep/mutations/setStepCompletion.mutation';
import setStepAutoCompletion from 'src/graphql/embed/EmbedStepAutoCompleteInteraction/mutations/setStepAutoCompletion.mutation';
import setStepSkipped from 'src/graphql/embed/EmbedStep/mutations/setStepSkipped.mutation';
import trackStepView from 'src/graphql/embed/EmbedStep/mutations/trackStepView';
import recordTagDismissed from './EmbedTaggedElement/mutations/recordTagDismissed.mutation';
import selectBranchingPath from 'src/graphql/embed/EmbedStep/mutations/selectBranchingPaths.mutation';
import saveGuideForLater from 'src/graphql/embed/EmbedGuide/mutations/saveGuideForLater.mutation';
import getDestinationGuide from 'src/graphql/embed/EmbedStepCta/mutations/getDestinationGuide.mutation';
import createTicket from './EmbedIntegration/mutations/createTicket.mutation';
import trackNpsSurveyViewed from './EmbedNpsSurvey/mutations/trackNpsSurveyView';
import trackCtaClicked from './EmbedStepCta/mutations/trackCtaClicked.mutation';
import answerNpsSurvey from './EmbedNpsSurvey/mutations/answerNpsSurvey';
import dismissNpsSurvey from './EmbedNpsSurvey/mutations/dismissNpsSurvey';

export default new GraphQLObjectType<unknown, EmbedContext>({
  name: 'Mutation',
  fields: {
    createTicket,
    dismissNpsSurvey,
    getDestinationGuide,
    recordTagDismissed,
    answerNpsSurvey,
    resetOnboarding,
    saveGuideForLater,
    selectBranchingPath,
    setStepAutoCompletion,
    setStepCompletion,
    setStepSkipped,
    trackCtaClicked,
    trackGuideView,
    trackNpsSurveyViewed,
    trackStepView,
  },
});
