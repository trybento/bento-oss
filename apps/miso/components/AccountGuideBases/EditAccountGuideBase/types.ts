import { EditAccountGuideBaseQuery } from 'relay-types/EditAccountGuideBaseQuery.graphql';

export type GuideStepBase =
  EditAccountGuideBaseQuery['response']['guideBase']['guideModuleBases'][number]['guideStepBases'][number];
export type GuideModuleBase =
  EditAccountGuideBaseQuery['response']['guideBase']['guideModuleBases'][number];
export type GuideBase = EditAccountGuideBaseQuery['response']['guideBase'];

type AccountGuideStep =
  EditAccountGuideBaseQuery['response']['guideBase']['accountGuide']['guideModules'][number]['steps'][number];

export type AccountStepsData = {
  [entityId: string]: AccountGuideStep;
};
