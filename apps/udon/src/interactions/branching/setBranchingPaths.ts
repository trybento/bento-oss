import promises from 'src/utils/promises';
import { keyBy, partition } from 'lodash';
import {
  BranchingEntityType,
  BranchingStyle,
  StepType,
  Theme,
} from 'bento-common/types';
import { EMPTY_STEP_NAME } from 'bento-common/utils/naming';

import {
  BranchingPath,
  BranchingPathType,
} from 'src/data/models/BranchingPath.model';
import { findBranchingPaths } from './findBranchingPaths';
import { isBranchingStep } from 'src/utils/stepHelpers';
import { isCarouselTheme } from 'bento-common/data/helpers';
import { Template } from 'src/data/models/Template.model';
import { Module } from 'src/data/models/Module.model';
import { Organization } from 'src/data/models/Organization.model';

export interface BranchingPathValue {
  label: string;
  choiceKey: string;
  templateEntityId?: string;
  moduleEntityId?: string;
  style?: BranchingStyle;
}

interface ValidateBranchingProps {
  stepType?: StepType;
  stepName?: string;
  branchingQuestion?: string;
  branchingPathData?: BranchingPathValue[];
  branchingEntityType?: BranchingEntityType;
  theme: Theme | undefined;
}

interface SetBranchingPathsProps {
  organization: Organization;
  branchingKey: string;
  branchingEntityType?: BranchingEntityType;
  branchingPathData?: BranchingPathValue[];
}

export function formatBranchingChoices(
  branchingPathData: BranchingPathValue[] | null | undefined
) {
  return branchingPathData?.length
    ? branchingPathData.map((bpv) => ({
        label: bpv.label,
        choiceKey: bpv.choiceKey,
        style: bpv.style,
      }))
    : null;
}

function branchingPathTempKey(bp: BranchingPathValue) {
  return `bp-${bp.choiceKey}-${bp.moduleEntityId}-${bp.templateEntityId}`;
}

export function validateBranchingPaths({
  stepType,
  stepName = EMPTY_STEP_NAME,
  branchingQuestion,
  branchingPathData = [],
  branchingEntityType,
  theme,
}: ValidateBranchingProps) {
  if (!isBranchingStep(stepType)) return null;

  const subError = `[Step] ${stepName}: `;

  /**
   * Guide branching not supported for:
   * - Carousel guides.
   */
  if (
    isCarouselTheme(theme) &&
    (branchingEntityType === BranchingEntityType.Guide ||
      branchingEntityType === BranchingEntityType.Template)
  )
    return {
      errors: [subError + 'Guide branching not supported.'],
    };

  if (branchingQuestion) {
    if (!branchingPathData?.length)
      return {
        errors: [
          subError + 'At least one option is required for branching paths',
        ],
      };

    for (const path of branchingPathData || []) {
      const { label, templateEntityId } = path || {};

      if (label) {
        if (
          !templateEntityId &&
          branchingEntityType !== BranchingEntityType.Module
        )
          return {
            errors: [subError + 'A target is required for branching paths'],
          };
      } else {
        return {
          errors: [subError + 'A label is required for branching paths'],
        };
      }
    }
  } else {
    return {
      errors: [subError + 'A question is required for branching steps'],
    };
  }

  return null;
}

function getTargetId(
  targetEntityId: string | null | undefined,
  targetsByEntityId: any
): number | null {
  return targetEntityId && targetsByEntityId?.[targetEntityId]?.id
    ? targetsByEntityId[targetEntityId].id
    : null;
}

export async function setBranchingPaths({
  organization,
  branchingKey,
  branchingEntityType = BranchingEntityType.Module,
  branchingPathData = [],
}: SetBranchingPathsProps) {
  const existingBranchingPaths = await findBranchingPaths({
    branchingKey,
    organizationId: organization.id,
  });

  const existingBranchingChoices: { [choiceKey: string]: BranchingPathValue } =
    {};

  const [branchingPathsToUpdate, branchingPathsToDelete] = partition(
    existingBranchingPaths,
    (bp) =>
      branchingPathData.findIndex((bpv) => {
        const exists = bp.choiceKey === bpv.choiceKey;
        if (exists) {
          existingBranchingChoices[bpv.choiceKey] = bpv;
          return true;
        } else {
          return false;
        }
      }) !== -1
  );

  // Delete discarded paths.
  await BranchingPath.destroy({
    where: {
      id: branchingPathsToDelete.map((bp) => bp.id),
    },
  });

  if (!branchingPathData.length) return [];

  const orderIndexesByPathData = {};
  const newBranchingChoices: BranchingPathValue[] = branchingPathData.filter(
    (bp, bpIdx) => {
      orderIndexesByPathData[branchingPathTempKey(bp)] = bpIdx;
      return (
        branchingPathsToUpdate.findIndex(
          (bpu) => bpu.choiceKey === bp.choiceKey
        ) === -1
      );
    }
  );

  const commonData = {
    branchingKey,
    entityType: branchingEntityType,
    actionType: BranchingPathType.Create,
  };

  // Get target IDs.
  const targets =
    branchingEntityType === BranchingEntityType.Guide
      ? await Template.findAll({
          where: {
            entityId: branchingPathData
              .map((bpv) => bpv.templateEntityId)
              .filter(Boolean) as string[],
          },
        })
      : await Module.findAll({
          where: {
            entityId: branchingPathData
              .map((bpv) => bpv.moduleEntityId)
              .filter(Boolean) as string[],
          },
        });

  const targetsByEntityId = keyBy(targets, 'entityId');

  // Update existing paths.
  const updatedPaths = await promises.mapSeries(
    branchingPathsToUpdate,
    async (bp) => {
      const bpv = existingBranchingChoices[bp.choiceKey];
      return await bp.update({
        ...commonData,
        choiceKey: bpv.choiceKey,
        templateId: getTargetId(bpv.templateEntityId, targetsByEntityId),
        moduleId: getTargetId(bpv.moduleEntityId, targetsByEntityId),
        organizationId: organization.id,
        orderIndex: orderIndexesByPathData[branchingPathTempKey(bpv)],
      });
    }
  );

  // Create new paths.
  const createdPaths = await promises.mapSeries(
    newBranchingChoices,
    async (bpv: BranchingPathValue) => {
      await BranchingPath.create({
        ...commonData,
        choiceKey: bpv.choiceKey,
        templateId: getTargetId(bpv.templateEntityId, targetsByEntityId),
        moduleId: getTargetId(bpv.moduleEntityId, targetsByEntityId),
        organizationId: organization.id,
        orderIndex: orderIndexesByPathData[branchingPathTempKey(bpv)],
      });
    }
  );

  return [...updatedPaths, createdPaths];
}
