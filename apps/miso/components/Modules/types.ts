import { EditModuleQuery } from 'relay-types/EditModuleQuery.graphql';

export type EditModule_Module = EditModuleQuery['response']['module'];
export type EditModule_StepPrototype =
  EditModule_Module['stepPrototypes'][number];
