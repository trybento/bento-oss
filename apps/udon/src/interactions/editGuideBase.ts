import { ModuleStepPrototype } from 'src/data/models/ModuleStepPrototype.model';
import { isEqual, keyBy } from 'lodash';
import { SelectedModelAttrs, StepType } from 'bento-common/types';
import { SlateBodyElement } from 'bento-common/types/slate';

import { withTransaction } from 'src/data';
import {
  attrsFromStepPrototype,
  GuideStepBase,
} from 'src/data/models/GuideStepBase.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { User } from 'src/data/models/User.model';
import { GuideModuleBase } from 'src/data/models/GuideModuleBase.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { Module } from 'src/data/models/Module.model';
import { createGuideBaseStepCtas } from './ctas/createGuideBaseStepCtas';
import { createGuideBaseStepAutoCompleteInteractions } from './autoComplete/createGuideBaseStepAutoCompleteInteractions';
import { createGuideBaseStepInputs } from './inputFields/createGuideBaseStepInputs';
import { guideBaseChanged } from 'src/data/events';
import { Template } from 'src/data/models/Template.model';

type StepData = {
  entityId: string;
  createdFromStepPrototypeEntityId: string;
  name: string;
  bodySlate: SlateBodyElement[];
  stepType: StepType;
  dismissLabel: string;
};

type ModuleData = {
  entityId: string;
  createdFromModuleEntityId: string;
  name: string;
  steps: StepData[];
};

export type EditGuideBaseData = {
  name?: string;
  description: string;
  modules: ModuleData[];
};

type EditGuideBaseArgs = {
  existingGuideBase: GuideBase & {
    createdFromTemplate: SelectedModelAttrs<Template, 'name'>;
  };
  editGuideBaseData: EditGuideBaseData;
  user: User;
};

export async function editGuideBase({
  existingGuideBase,
  editGuideBaseData,
  user,
}: EditGuideBaseArgs) {
  const moduleData = editGuideBaseData.modules.filter(Boolean);

  const guideModuleBaseEntityIds = moduleData
    .map((moduleDatum) => moduleDatum.entityId)
    .filter(Boolean);

  // Fetch existing guide modules
  const existingGuideModuleBases = (await GuideModuleBase.findAll({
    where: {
      guideBaseId: existingGuideBase.id,
    },
    order: [['orderIndex', 'asc']],
    include: [{ model: GuideStepBase, include: [StepPrototype] }, Module],
  })) as Array<
    GuideModuleBase & {
      guideStepBases: Array<
        GuideStepBase & {
          createdFromStepPrototype: StepPrototype;
        }
      >;
      createdFromModule: Module;
    }
  >;

  const existingGuideModuleBasesByEntityId = keyBy(
    existingGuideModuleBases,
    'entityId'
  );

  const guideModuleBaseIdsToDelete = existingGuideModuleBases
    .filter(
      (guideModuleBase) =>
        !guideModuleBaseEntityIds.includes(guideModuleBase.entityId)
    )
    .map((existingGuideModuleBase) => existingGuideModuleBase.id);

  // Fetch existing original modules
  const createdFromModuleEntityIds = moduleData
    .map((moduleDatum) => moduleDatum.createdFromModuleEntityId)
    .filter(Boolean);

  const createdFromModules = await Module.findAll({
    where: {
      entityId: createdFromModuleEntityIds,
      organizationId: existingGuideBase.organizationId,
    },
    include: [
      {
        model: ModuleStepPrototype,
        attributes: ['id'],
        include: [StepPrototype],
      },
    ],
  });

  const createdFromModulesByEntityId = keyBy(createdFromModules, 'entityId');

  const existingGuideStepBases = existingGuideModuleBases.flatMap(
    (gmb) => gmb.guideStepBases
  );

  const existingGuideStepBasesByEntityId = keyBy(
    existingGuideStepBases,
    'entityId'
  );

  const createdFromStepPrototypes = createdFromModules.flatMap((m) =>
    m.moduleStepPrototypes.map((msp) => msp.stepPrototype)
  ) as StepPrototype[];

  const createdFromStepPrototypesByEntityId = keyBy(
    createdFromStepPrototypes,
    'entityId'
  );

  let hasContentChanged: boolean | undefined = undefined;

  await withTransaction(async () => {
    for (const [moduleIdx, moduleDatum] of moduleData.entries()) {
      const {
        entityId: guideModuleBaseEntityId,
        createdFromModuleEntityId,
        name: guideModuleBaseName,
        steps: stepsData,
      } = moduleDatum;

      const existingGuideModuleBase =
        guideModuleBaseEntityId &&
        existingGuideModuleBasesByEntityId[guideModuleBaseEntityId];

      const createdFromModule = createdFromModuleEntityId
        ? createdFromModulesByEntityId[createdFromModuleEntityId]
        : null;

      let guideModuleBase: GuideModuleBase;

      if (existingGuideModuleBase) {
        const hasNameChanged = !isEqual(
          existingGuideModuleBase.createdFromModule.name,
          guideModuleBaseName
        );

        if (
          hasNameChanged ||
          !isEqual(existingGuideModuleBase.orderIndex, moduleIdx)
        ) {
          hasContentChanged = true;
        }

        guideModuleBase = await existingGuideModuleBase.update({
          name: hasNameChanged ? guideModuleBaseName : null,
          orderIndex: moduleIdx,
          createdFromModuleId: createdFromModule?.id,
          updatedByUserId: user.id,
        });
      } else {
        hasContentChanged = true;

        [guideModuleBase] = await GuideModuleBase.upsert(
          {
            orderIndex: moduleIdx,
            createdFromModuleId: createdFromModule?.id,
            guideBaseId: existingGuideBase.id,
            organizationId: existingGuideBase.organizationId,
            createdByUserId: user.id,
            updatedByUserId: user.id,
          },
          {
            returning: true,
            conflictFields: ['guide_base_id', 'created_from_module_id'] as any,
          }
        );
      }

      const createdGuideBaseSteps: GuideStepBase[] = [];

      for (const [stepIdx, stepDatum] of stepsData.entries()) {
        const {
          entityId: stepEntityId,
          createdFromStepPrototypeEntityId,
          name: stepName,
          bodySlate,
        } = stepDatum;

        const existingGuideStepBase =
          stepEntityId && existingGuideStepBasesByEntityId[stepEntityId];
        const createdFromStepPrototype = createdFromStepPrototypeEntityId
          ? createdFromStepPrototypesByEntityId[
              createdFromStepPrototypeEntityId
            ]
          : null;

        let guideStepBase: GuideStepBase;

        const upsertData = {
          name: stepName,
          orderIndex: stepIdx,
          bodySlate,
        };

        if (existingGuideStepBase) {
          if (
            !isEqual(existingGuideStepBase.name, stepName) ||
            !isEqual(existingGuideStepBase.orderIndex, stepIdx) ||
            !isEqual(existingGuideStepBase.bodySlate, bodySlate)
          ) {
            hasContentChanged = true;
          }

          guideStepBase = await existingGuideStepBase.update({
            ...upsertData,
            updatedByUserId: user.id,
          });
        } else {
          hasContentChanged = true;

          if (!createdFromStepPrototype) {
            throw new Error('Expected a StepPrototype to create off of');
          }

          [guideStepBase] = await GuideStepBase.upsert(
            {
              ...attrsFromStepPrototype(createdFromStepPrototype, {
                ...upsertData,
                guideBaseId: existingGuideBase.id,
                guideModuleBaseId: guideModuleBase.id,
                organizationId: existingGuideBase.organizationId,
                createdByUserId: user.id,
                updatedByUserId: user.id,
              }),
            },
            {
              returning: true,
              conflictFields: [
                'guide_base_id',
                'created_from_step_prototype_id',
              ] as any,
            }
          );

          createdGuideBaseSteps.push(guideStepBase);
        }
      }

      await createGuideBaseStepCtas({
        guideStepBases: createdGuideBaseSteps,
      });
      await createGuideBaseStepAutoCompleteInteractions({
        guideStepBases: createdGuideBaseSteps,
      });
      await createGuideBaseStepInputs({
        guideStepBases: createdGuideBaseSteps,
      });
    }

    if (guideModuleBaseIdsToDelete.length > 0) {
      hasContentChanged = true;
    }

    await GuideStepBase.destroy({
      where: {
        guideModuleBaseId: guideModuleBaseIdsToDelete,
      },
    });

    await GuideModuleBase.destroy({
      where: {
        id: guideModuleBaseIdsToDelete,
      },
    });

    if (
      !isEqual(
        existingGuideBase.createdFromTemplate.name,
        editGuideBaseData.name
      )
    ) {
      hasContentChanged = true;
    }

    await existingGuideBase.update({
      isModifiedFromTemplate: hasContentChanged,
      updatedByUserId: user.id,
    });

    if (hasContentChanged) {
      guideBaseChanged(existingGuideBase.entityId);
    }

    return existingGuideBase;
  });
}
