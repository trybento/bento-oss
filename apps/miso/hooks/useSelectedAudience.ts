import { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import { GroupTargeting } from 'bento-common/types/targeting';

import AudiencesQuery from 'queries/AudiencesQuery';
import { AudiencesQuery as AudiencesQueryType } from 'relay-types/AudiencesQuery.graphql';
import BranchingQuestionsQuery, {
  BranchingQuestions,
} from 'queries/BranchingQuestionsQuery';

type UnCastAudience = AudiencesQueryType['response']['audiences'][number];

export type CastAudience = Omit<UnCastAudience, 'targets'> & {
  targets: GroupTargeting;
};

export type Audiences = CastAudience[];

/**
 * Convenient hook used to find the audience a template
 * belongs to. Pass props if this is inside a list
 * to reduces the number of requests made to the server.
 *
 * Needs to be wrapped in AttributesProvider.
 */
const useSelectedAudience = (
  props: {
    branchingQuestions?: BranchingQuestions;
    audiences?: Audiences;
    targets?: GroupTargeting;
  } = {}
) => {
  const [branchingQuestions, setBranchingQuestions] =
    useState<BranchingQuestions>(props.branchingQuestions || []);
  const [audiences, setAudiences] = useState<Audiences>(props.audiences || []);
  const [selectedAudience, setSelectedAudience] = useState<
    Audiences[number] | null
  >(null);

  useEffect(() => {
    void (async () => {
      if (!props.branchingQuestions) {
        const {
          organization: { branchingQuestions },
        } = await BranchingQuestionsQuery();
        setBranchingQuestions(branchingQuestions);
      }
      if (!props.audiences) {
        const res = await AudiencesQuery();
        setAudiences((res.audiences || []) as Audiences);
      }
    })();
  }, []);

  useEffect(() => {
    const wrapper = async () => {
      if (props.targets) {
        const match = audiences.find((a) => isEqual(a.targets, props.targets));

        setSelectedAudience(match);
      }
    };

    wrapper();
  }, [props.targets, audiences]);

  return {
    audiences,
    branchingQuestions,
    selectedAudience,
  };
};

export default useSelectedAudience;
