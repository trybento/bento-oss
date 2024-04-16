import Dataloader from 'dataloader';
import getAnswersCountForTemplate from 'src/interactions/analytics/stats/getAnswersCountForTemplate';

export default function inputStepAnswersOfTemplateCountLoader() {
  return new Dataloader<number, number>(async (templateIds) =>
    getAnswersCountForTemplate(templateIds)
  );
}
