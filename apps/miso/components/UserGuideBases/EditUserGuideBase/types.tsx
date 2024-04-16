import { EditUserGuideBase_guideBase$data } from 'relay-types/EditUserGuideBase_guideBase.graphql';

type UserFragment = {
  readonly fullName: string;
  readonly email: string;
};

export type GuideBase = EditUserGuideBase_guideBase$data;
export type GuideModuleBase = GuideBase['guideModuleBases'][number];
export type GuideStepBase = GuideModuleBase['guideStepBases'][number];
export type GuideStepBaseSteps = GuideStepBase['steps'][number];
export type StepTrigger = GuideModuleBase['dynamicallyAddedByStep'];

/** StepBase type to be fed to editors for reading uploads */
export type StepBases = {
  [entityId: string]: {
    steps: Readonly<GuideStepBaseSteps[]>;
    usersViewed: Readonly<UserFragment[]>;
    usersCompleted: Readonly<UserFragment[]>;
    countUsersCompleted: number;
    percentageCompleted: number;
  };
};

export type GuideModuleBaseParticipantsCount = {
  [entityId: string]: number;
};

export type AutoCompletableStepEntityIds = {
  [entityId: string]: boolean;
};
