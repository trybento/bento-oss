import { graphql } from 'react-relay';

import commitMutation from './commitMutation';

import { TestAutolaunchRulesMutation } from 'relay-types/TestAutolaunchRulesMutation.graphql';

const mutationName = 'testAutoLaunchRulesMutation';
const mutation = graphql`
  mutation TestAutolaunchRulesMutation($input: TestAutolaunchRulesInput!) {
    testAutolaunchRules(input: $input) {
      accountUsers
      accounts
      errors
    }
  }
`;

type Args = TestAutolaunchRulesMutation['variables']['input'];

export function commit({
  targets,
  templateEntityId,
}: Args): Promise<TestAutolaunchRulesMutation['response']> {
  const variables: any = {
    input: {
      targets,
      templateEntityId,
    },
  };

  return commitMutation({
    mutation,
    mutationName,
    variables,
  });
}
