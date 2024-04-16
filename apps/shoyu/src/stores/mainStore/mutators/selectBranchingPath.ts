import { SelectBranchingPathMutationDocument } from './../../../graphql/mutations/generated/SelectBranchingPath';
import {
  SelectBranchingPathInput,
  SelectBranchingPathPayload,
} from './../../../graphql/schema.types';
import mutatorFactory from './factory';

const selectBranchingPath = mutatorFactory<
  SelectBranchingPathInput,
  SelectBranchingPathPayload
>('selectBranchingPath', SelectBranchingPathMutationDocument);
export default selectBranchingPath;
