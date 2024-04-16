import { GuideTypeEnum } from 'bento-common/types';
import { Template } from 'src/data/models/Template.model';
import { TemplateSplitTarget } from 'src/data/models/TemplateSplitTarget.model';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import detachPromise from 'src/utils/detachPromise';
import { randomFromArray } from 'src/utils/helpers';

/*
 * How we should pick a target candidate
 * Trigger count is supposed to be round-robinesque, but without a place
 *   to explicitly store an rr key we attempt to even out distribution instead
 */
enum SelectionMethod {
  /** Choose the template with the lowest trigger count */
  triggerCount = 'triggerCount',
  /** Choose randomly */
  random = 'random',
}

type Args = {
  splitTestTemplate: Template;
  selectionMethod?: SelectionMethod;
};

/**
 * If given a split test template, run logic to choose
 *   which target should launch, and return it
 */
export default async function getSplitTestTemplate({
  splitTestTemplate,
  selectionMethod = SelectionMethod.triggerCount,
}: Args) {
  if (splitTestTemplate.type !== GuideTypeEnum.splitTest)
    return splitTestTemplate;

  const splitTestTargets = await TemplateSplitTarget.findAll({
    where: {
      sourceTemplateId: splitTestTemplate.id,
    },
    include: [
      {
        model: Template,
        as: 'destinationTemplate',
        include: [
          { model: TemplateTarget, attributes: ['targetType', 'rules'] },
        ],
      },
    ],
    ...(selectionMethod === SelectionMethod.triggerCount
      ? {
          order: [['triggeredTimes', 'ASC']],
        }
      : {}),
  });

  if (splitTestTargets.length === 0) return undefined;

  let chosen: TemplateSplitTarget;

  switch (selectionMethod) {
    case SelectionMethod.triggerCount:
      chosen = splitTestTargets[0];
      break;
    case SelectionMethod.random:
      chosen = randomFromArray(splitTestTargets);
      break;
    default:
      throw new Error('Unsupported selection method');
  }

  detachPromise(
    () => chosen.update({ triggeredTimes: (chosen.triggeredTimes ?? 0) + 1 }),
    'update split trigger times'
  );

  return chosen.destinationTemplate;
}
