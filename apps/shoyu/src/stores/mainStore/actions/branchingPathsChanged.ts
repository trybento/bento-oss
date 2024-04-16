import {
  BranchingPaths,
  GlobalStateActionPayload,
} from 'bento-common/types/globalShoyuState';
import { normalize } from 'normalizr';
import { WorkingState } from '../types';
import schema from '../schema';

export default function branchingPathsChanged(
  state: WorkingState,
  { branchingPaths }: GlobalStateActionPayload<'branchingPathsChanged'>
) {
  if (branchingPaths.length === 0) {
    state.branchingPaths = {} as BranchingPaths;
  } else {
    const {
      entities: { branchingPaths: paths, ...guideEntities },
    } = normalize(branchingPaths, [schema.branchingPath]);
    state.branchingPaths = { paths, ...guideEntities } as BranchingPaths;
  }
}
