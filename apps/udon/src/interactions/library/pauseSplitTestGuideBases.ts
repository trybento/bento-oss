import { GuideBaseState } from 'bento-common/types';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';

type Args = {
  splitTestTemplate: Template;
};

/**
 * When we stop a split test, pause all guide bases so that new
 *   users no longer will get them
 */
export default async function pauseSplitTestGuideBases({
  splitTestTemplate,
}: Args) {
  await GuideBase.update(
    {
      state: GuideBaseState.paused,
    },
    {
      where: {
        createdFromSplitTestId: splitTestTemplate.id,
      },
    }
  );
}
