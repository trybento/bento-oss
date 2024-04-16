import { findNodeByOriginNodeId } from 'src/utils/slate/findNodeByOriginNodeId';

import sampleSlate from './testData/sampleSlate.json';

test('returns only the first match', () => {
  expect(
    findNodeByOriginNodeId(sampleSlate, '59db0d6b-807c-4219-a1b9-03548c17a5ad')
  ).toBe(sampleSlate[2].children[0]);
});

test("doesn't find anything if the originNodeId doens't exist", () => {
  expect(findNodeByOriginNodeId(sampleSlate, 'nonexistent')).toBeUndefined();
});
