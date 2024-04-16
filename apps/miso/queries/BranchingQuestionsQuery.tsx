import { graphql } from 'react-relay';
import fetchQuery from './fetchQuery';
import { BranchingQuestionsQuery } from 'relay-types/BranchingQuestionsQuery.graphql';

export type BranchingQuestions =
  BranchingQuestionsQuery['response']['organization']['branchingQuestions'];

const BRANCHING_QUESTIONS_QUERY = graphql`
  query BranchingQuestionsQuery {
    organization {
      id
      branchingQuestions {
        id
        question
        branchingKey
        choices {
          id
          choiceKey
          label
        }
      }
    }
  }
`;

const commit = () => {
  return fetchQuery<
    BranchingQuestionsQuery['variables'],
    BranchingQuestionsQuery['response']
  >({
    query: BRANCHING_QUESTIONS_QUERY,
    variables: {},
    options: {
      networkCacheConfig: { force: true },
    },
  });
};

export default commit;
