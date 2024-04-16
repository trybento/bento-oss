import { GraphQLNonNull } from 'graphql';

import generateMutation from 'src/graphql/helpers/generateMutation';
import ModuleType from 'src/graphql/Module/Module.graphql';

import {
  ModuleInput,
  ModuleInputType,
  validateStepPrototypes,
} from './moduleMutations.helpers';
import createModule from 'src/interactions/library/createModule';

export default generateMutation({
  name: 'CreateModule',
  description: 'Creating a new module',
  inputFields: {
    moduleData: {
      type: new GraphQLNonNull(ModuleInputType),
    },
  },
  outputFields: {
    module: {
      type: ModuleType,
    },
  },
  mutateAndGetPayload: async (
    { moduleData }: { moduleData: ModuleInput },
    { organization, user }
  ) => {
    // Validate step branching.
    const validationErrors = await validateStepPrototypes({
      input: moduleData.stepPrototypes || [],
      theme: undefined,
    });
    if (validationErrors) return validationErrors;

    const module = await createModule({
      moduleData,
      user,
      organization,
    });

    return { module };
  },
});
