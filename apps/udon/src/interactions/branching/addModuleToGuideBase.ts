import { Nullable, SelectedModelAttrsPick } from 'bento-common/types';

import { withTransaction } from 'src/data';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import { Step } from 'src/data/models/Step.model';
import {
  GuideModule,
  GuideModuleModelScope,
  GuideModuleWithBase,
} from 'src/data/models/GuideModule.model';
import { Guide } from 'src/data/models/Guide.model';
import {
  GuideModuleBase,
  GuideModuleBaseModelScope,
} from 'src/data/models/GuideModuleBase.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Module } from 'src/data/models/Module.model';
import createModuleBaseFromModule from '../launching/createModuleBaseFromModule';
import { addGuideModuleBaseToGuide } from './addGuideModuleBaseToGuide';
import { rebuildGuideModuleBasesOrderIndex } from './rebuildGuideModuleBasesOrderIndex';

type Args = {
  /** Which GuideBase should be affected */
  guideBase: GuideBase;
  /** Which module should be added to the GuideBase */
  module: Module;
  /** Should only add to new guides dynamically? */
  shouldOnlyAddToNewGuidesDynamically: boolean;
  /**
   * Which guide should be immediately affected.
   *
   * Knowing this information is important to:
   *
   * 1. Synchronously create the necessary GuideModule instance for the given guide.
   * 2. Kick-off a sync to propagate that change to other guide instances in the background (to-do)
   */
  guide: Guide | number;
  /** Which step triggered the branching action */
  step: Step;
};

/**
 * Adds a given Module to an existing GuideBase instance.
 *
 * @returns Promise the created GuideModuleBase and GuideModule instances
 */
export async function addModuleToGuideBase({
  guideBase,
  module,
  shouldOnlyAddToNewGuidesDynamically,
  guide,
  step,
}: Args): Promise<{
  guideModuleBase: GuideModuleBase;
  guideModule: GuideModule;
}> {
  return withTransaction(async () => {
    const guideModuleBases = await GuideModuleBase.scope([
      GuideModuleBaseModelScope.byOrderIndex,
      GuideModuleBaseModelScope.withStepBases,
    ]).findAll({ where: { guideBaseId: guideBase.id } });

    const afterGuideModule = (await GuideModule.scope(
      GuideModuleModelScope.withBase
    ).findOne({
      attributes: ['id', 'orderIndex'],
      where: { id: step.guideModuleId },
    })) as Nullable<
      GuideModuleWithBase<
        SelectedModelAttrsPick<GuideModule, 'id' | 'orderIndex'>
      >
    >;

    if (!afterGuideModule) {
      throw new Error(
        'Refused to add module to guide base after an unknown module'
      );
    }

    let guideModuleBase: GuideModuleBase;
    let guideStepBases: GuideStepBase[];

    const existingGuideModuleBase = guideModuleBases.find(
      (gmb) => gmb.createdFromModuleId === module.id
    ) as GuideModuleBase | undefined;

    if (existingGuideModuleBase) {
      guideModuleBase = existingGuideModuleBase;
      ({ guideStepBases } = existingGuideModuleBase);
    } else {
      ({ guideModuleBase, guideStepBases } = await createModuleBaseFromModule({
        guideBase,
        module,
        /**
         * Since GuideModuleBase and GuideModule's order indexes can diverge over time, this
         * uses the associated GuideModuleBase which triggered the branching action as a
         * reference for the order index.
         */
        orderIndex: afterGuideModule.createdFromGuideModuleBase.orderIndex + 1,
        addedDynamically: true,
        shouldOnlyAddToNewGuidesDynamically,
      }));
    }

    /**
     * Re-computes the order index of each GuideModuleBase associated with the affected guide base
     * to ensure that the new instance is properly inserted in the right position and all subsequent
     * instances are shifted by 1.
     */
    await rebuildGuideModuleBasesOrderIndex({ guideBase });

    const template =
      guideBase.createdFromTemplate ??
      (await guideBase.$get('createdFromTemplate', {
        attributes: ['type'],
      }));

    if (!template?.type) {
      throw new Error('Missing template or type associated with guide base');
    }

    guide = guide instanceof Guide ? guide : (await Guide.findByPk(guide))!;

    if (!guide) {
      throw new Error('Guide not found');
    }

    const guideModule = await addGuideModuleBaseToGuide({
      guide,
      guideModuleBase,
      guideStepBases,
      /**
       * Since GuideModuleBase and GuideModule's order indexes can diverge over time, this
       * uses the GuideModule which triggered the branching action as a reference
       * for the order index.
       */
      orderIndex: afterGuideModule.orderIndex + 1,
    });

    return { guideModuleBase, guideModule };
  });
}
