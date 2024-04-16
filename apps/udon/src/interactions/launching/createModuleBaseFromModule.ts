import { SelectedModelAttrs } from 'bento-common/types';

import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideModuleBase } from 'src/data/models/GuideModuleBase.model';
import { Module } from 'src/data/models/Module.model';
import { ModuleStepPrototype } from 'src/data/models/ModuleStepPrototype.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import {
  attrsFromStepPrototype,
  bulkUpsertGuideStepBase,
} from 'src/data/models/GuideStepBase.model';
import { User } from 'src/data/models/User.model';
import { createGuideBaseStepAutoCompleteInteractions } from '../autoComplete/createGuideBaseStepAutoCompleteInteractions';
import { createGuideBaseStepCtas } from '../ctas/createGuideBaseStepCtas';
import { createGuideBaseStepInputs } from '../inputFields/createGuideBaseStepInputs';

type Args = {
  guideBase: SelectedModelAttrs<GuideBase, 'id' | 'organizationId'>;
  module: Module;
  orderIndex: number;
  user?: User;
  addedDynamically?: boolean;
  shouldOnlyAddToNewGuidesDynamically?: boolean;
};

export default async function createModuleBaseFromModule({
  guideBase,
  module,
  orderIndex,
  user,
  addedDynamically,
  shouldOnlyAddToNewGuidesDynamically,
}: Args) {
  const organizationId = guideBase.organizationId;

  const moduleStepPrototypes = await ModuleStepPrototype.scope([
    'withStepPrototype',
    'byOrderIndex',
  ]).findAll({
    where: { moduleId: module.id },
    attributes: ['id', 'orderIndex'],
  });

  const stepPrototypes = moduleStepPrototypes.map(
    (msp) => msp.stepPrototype
  ) as StepPrototype[];

  const [guideModuleBase] = await GuideModuleBase.upsert(
    {
      guideBaseId: guideBase.id,
      organizationId: organizationId,
      orderIndex,
      createdFromModuleId: module.id,
      createdByUserId: user?.id,
      updatedByUserId: user?.id,
      addedDynamicallyAt: addedDynamically ? new Date() : undefined,
      shouldOnlyAddToNewGuidesDynamically,
    },
    {
      returning: true,
      conflictFields: ['guide_base_id', 'created_from_module_id'] as any,
    }
  );

  const guideStepBaseAttrs = stepPrototypes.map((stepPrototype, idx) =>
    attrsFromStepPrototype(stepPrototype, {
      orderIndex: moduleStepPrototypes[idx].orderIndex,
      guideBaseId: guideBase.id,
      guideModuleBaseId: guideModuleBase.id,
      createdByUserId: user?.id,
      updatedByUserId: user?.id,
    })
  );

  const guideStepBases = await bulkUpsertGuideStepBase(guideStepBaseAttrs);

  await createGuideBaseStepCtas({ guideStepBases });
  await createGuideBaseStepAutoCompleteInteractions({ guideStepBases });
  await createGuideBaseStepInputs({ guideStepBases });

  return { guideModuleBase, guideStepBases };
}
