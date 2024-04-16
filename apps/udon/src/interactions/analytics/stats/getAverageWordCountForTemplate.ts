import promises from 'src/utils/promises';
import { keyBy } from 'lodash';

import { countWords } from 'bento-common/utils/slateWordCount';
import { Module } from 'src/data/models/Module.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { Template } from 'src/data/models/Template.model';

export default async function getAverageWordCountsForTemplates(
  templateIds: number[]
) {
  const templates = await Template.scope('contentTemplates').findAll({
    where: { id: templateIds },
    include: [{ model: Module, include: [StepPrototype] }],
  });

  const templatesById = keyBy(templates, 'id');

  const results = await promises.map(templateIds, async (templateId) => {
    const template = templatesById[templateId];

    if (!template || !template.modules) return 0;

    const stepProtoWordCounts = template.modules.reduce((a, m) => {
      if (m.stepPrototypes.length) {
        a.push(
          m.stepPrototypes.reduce((a, sp) => a + countWords(sp.bodySlate), 0)
        );
      } else {
        a.push(0);
      }
      return a;
    }, [] as number[]);

    if (stepProtoWordCounts.length === 0) return 0;

    return (
      stepProtoWordCounts.reduce((a, b) => a + b, 0) /
      stepProtoWordCounts.length
    );
  });

  return results;
}
