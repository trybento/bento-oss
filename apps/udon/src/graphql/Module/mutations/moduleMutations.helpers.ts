import { uniq } from 'lodash';
import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';
import { AutoCompleteInteractionInputType } from 'bento-common/graphql/autoCompleteInteractions';
import {
  BranchingEntityType,
  CtaInput,
  GuideFormFactor,
  StepAutoCompleteInteractionInput,
  StepAutoCompleteRule,
  StepEventMappingInput,
  StepInputFieldInput,
  StepType,
  TagInput,
  Theme,
} from 'bento-common/types';
import { StepAutoCompleteInteraction } from 'bento-common/types/stepAutoComplete';
import { VisualTagStyleSettingsInputType } from 'bento-common/graphql/visualTags';
import { BranchingFormFactor } from 'bento-common/types/globalShoyuState';
import { areFlowCtasCompliant } from 'bento-common/validation/guide';

import { Module } from 'src/data/models/Module.model';
import { TemplateModule } from 'src/data/models/TemplateModule.model';
import AuditContext, { AuditEvent, AuditType } from 'src/utils/auditContext';
import {
  BranchingPathValue,
  validateBranchingPaths,
} from 'src/interactions/branching/setBranchingPaths';
import EntityId from 'bento-common/graphql/EntityId';
import { StepAutoCompleteInteractionTypeEnumType } from 'src/graphql/StepPrototypeAutoCompleteInteraction/StepPrototypeAutoCompleteInteraction.graphql';
import {
  BranchingEntityEnumType,
  BranchingFormFactorEnumType,
  StepTypeEnumType,
} from 'src/graphql/graphQl.types';
import {
  StepEventMappingInputType,
  StepEventMappingRuleInputType,
} from 'src/graphql/StepEventMapping/mutations/setStepAutoCompleteMapping';
import { InputFieldFactoryListInput } from 'src/graphql/InputStep/inputSettings';
import { isInputStep, isVideoGalleryTheme } from 'bento-common/data/helpers';
import { inputFieldsSchema } from 'src/graphql/Template/mutations/helpers';
import { BranchingStyleInputType } from 'src/graphql/Branching/branchingStyle';
import {
  StepCtaSettingsInputType,
  StepCtaStyleEnumType,
  StepCtaTypeEnumType,
} from 'bento-common/graphql/stepCtas';
import { MediaReferenceInputType } from 'src/graphql/Media/MediaReference.graphql';
import { MediaReferenceInput } from 'bento-common/types/media';
import {
  ContextTagAlignmentEnumType,
  ContextTagTooltipAlignmentEnumType,
  ContextTagTypeEnumType,
} from 'src/graphql/StepPrototypeTaggedElement/StepPrototypeTaggedElement.graphql';
import { graphQlError } from 'src/graphql/utils';
import { TemplateInput } from 'src/graphql/Template/mutations/editTemplate';

export const EditTaggedElementInputType = new GraphQLInputObjectType({
  name: 'EditTaggedElementInput',
  fields: {
    entityId: {
      type: EntityId,
    },
    url: {
      type: GraphQLString,
    },
    wildcardUrl: {
      type: GraphQLString,
    },
    elementSelector: {
      type: GraphQLString,
    },
    elementText: {
      type: GraphQLString,
    },
    elementHtml: {
      type: GraphQLString,
    },
    type: {
      type: ContextTagTypeEnumType,
    },
    alignment: {
      type: ContextTagAlignmentEnumType,
    },
    xOffset: {
      type: GraphQLInt,
    },
    yOffset: {
      type: GraphQLInt,
    },
    relativeToText: {
      type: GraphQLBoolean,
    },
    tooltipAlignment: {
      type: ContextTagTooltipAlignmentEnumType,
    },
    style: {
      type: VisualTagStyleSettingsInputType,
    },
  },
});

/*
 * ==== HELPERS ====
 */

/**
 * See what templates use this module and update their audits accordingly
 * @todo transform into async job
 */
export const updateAffectedTemplates = async ({
  auditContext,
  module,
  templateIds,
  isDelete,
  updatedFromTemplateId,
}: {
  module: Module;
  auditContext: AuditContext;
  templateIds?: number[];
  isDelete?: boolean;
  updatedFromTemplateId?: number;
}) => {
  let _templateIds = templateIds;

  if (!_templateIds) {
    const templateModules = await TemplateModule.findAll({
      where: {
        moduleId: module.id,
      },
    });
    _templateIds = uniq(templateModules.map((tm) => tm.templateId))?.filter(
      (id) => id !== updatedFromTemplateId
    );
  }

  if (!_templateIds.length) return;

  _templateIds.forEach((templateId) => {
    /** Don't double-log for a template update */
    if (templateId === updatedFromTemplateId) return;

    auditContext.logEvent({
      eventName: isDelete
        ? AuditEvent.contentChanged
        : AuditEvent.subContentChanged,
      targets: [{ type: AuditType.Template, id: templateId }],
      data: isDelete ? {} : { moduleId: module.id },
    });
  });
};

/**
 * Validate Step Prototypes input fields to make sure data is complaint with Schema and
 * additional business rules/constraints.
 *
 * Ideally this method would be called in the mutation itself, before any piece of data is saved,
 * so that it is cheaper/faster than rolling back transactions.
 *
 * @todo move this up in the chain wherever called (ideally in the mutation)
 */
export const validateStepPrototypes = async ({
  input,
  theme = undefined,
  allowNamelessSteps = false,
  shouldValidateCtas = false,
}: {
  input: StepPrototypeInput[];
  /**
   * @default undefined
   */
  theme: Theme | undefined;
  /**
   * @default false
   */
  allowNamelessSteps?: boolean;
  /**
   * Should we validate the CTAs?
   *
   * WARNING: Currently, this should only be set for Flows and will enforce that Link-type CTAs that mark
   * the step as completed cannot redirect to a different URL than the next step.
   * @default false
   */
  shouldValidateCtas?: boolean;
}) => {
  if (!input.length) {
    return graphQlError('At least one step is required');
  }

  for (let i = 0; i < input.length; i++) {
    const stepPrototypeInput = input[i];
    const nextStepPrototypeInput = input[i + 1];

    // Validate step branching.
    const branchingErrors = validateBranchingPaths({
      stepName: stepPrototypeInput?.name,
      stepType: stepPrototypeInput?.stepType,
      branchingPathData: stepPrototypeInput?.branchingPathData,
      branchingQuestion: stepPrototypeInput.branchingQuestion,
      branchingEntityType: stepPrototypeInput.branchingEntityType,
      theme,
    });
    if (branchingErrors) return branchingErrors;
    if (!stepPrototypeInput.name && !allowNamelessSteps) {
      return graphQlError(
        isVideoGalleryTheme(theme)
          ? 'Videos require a title'
          : 'Steps require a name'
      );
    }

    if (
      isInputStep(stepPrototypeInput?.stepType) &&
      stepPrototypeInput?.inputs
    ) {
      /**
       * @todo consolidate all the template validations in a single schema
       * and improve the path/error messages (including branching)
       */
      await inputFieldsSchema.validate(stepPrototypeInput?.inputs);
    }

    /**
     * Specifically for Flow-type guides, check whether a CTA in the Step redirects the user
     * to a different URL than the next step, since that would break the flow.
     */
    if (
      shouldValidateCtas &&
      stepPrototypeInput?.ctas?.length &&
      nextStepPrototypeInput?.taggedElements?.length &&
      !areFlowCtasCompliant(
        stepPrototypeInput.ctas || [],
        nextStepPrototypeInput.taggedElements[0].wildcardUrl
      )
    ) {
      return graphQlError(
        'At least one of your CTA buttons is invalid. See warning icon(s)'
      );
    }
  }
};

/*
 * ==== TYPES ====
 */
export interface NewStepPrototypeInput {
  entityId?: string;
  name?: string;
  body?: string;
  bodySlate?: object[];
  mediaReferences?: MediaReferenceInput[];
  stepType?: StepType;
  dismissLabel?: string;
}
export interface StepPrototypeInput extends NewStepPrototypeInput {
  /** // @deprecated Use eventMappings. */
  eventName?: string;
  /** // @deprecated Use eventMappings. */
  completeForWholeAccount?: boolean;
  stepType: StepType;
  /** // @deprecated Use eventMappings. */
  stepEventMappingRules?: StepAutoCompleteRule[];
  eventMappings?: StepEventMappingInput[];
  ctas?: CtaInput[];
  autoCompleteInteraction?: StepAutoCompleteInteractionInput;
  autoCompleteInteractions?: StepAutoCompleteInteraction[];
  branchingQuestion?: string;
  branchingMultiple?: boolean;
  branchingDismissDisabled?: boolean;
  branchingEntityType?: BranchingEntityType;
  branchingPathData?: BranchingPathValue[];
  branchingFormFactor?: BranchingFormFactor;
  inputs?: StepInputFieldInput[];
  manualCompletionDisabled?: boolean;
  snappyAt?: Date;
  taggedElements?: TagInput[];
}

export interface NewModuleInput {
  /**
   * The single name of the module, used both internally and publicly.
   */
  name?: string;
  /**
   * @deprecated use `name` instead
   * @todo remove after D+7
   */
  displayTitle?: string;
  description?: string;
  entityId?: string;
  stepPrototypes: NewStepPrototypeInput[];
  isCyoa?: boolean;
  createdFromFormFactor?: GuideFormFactor;
}
export interface ModuleInput extends NewModuleInput {
  entityId: string;
  stepPrototypes: StepPrototypeInput[];
}

/*
 * ==== GRAPHQL TYPES ====
 */

const BranchingPathInputType = new GraphQLInputObjectType({
  name: 'BranchingPathInput',
  fields: {
    choiceKey: {
      type: GraphQLString,
    },
    label: {
      type: GraphQLString,
    },
    templateEntityId: {
      type: GraphQLString,
    },
    moduleEntityId: {
      type: GraphQLString,
    },
    style: {
      type: BranchingStyleInputType,
    },
  },
});

const StepPrototypeAutoCompleteInteractionInputType =
  new GraphQLInputObjectType({
    name: 'StepPrototypeAutoCompleteInteractionInput',
    fields: {
      entityId: {
        type: EntityId,
      },
      url: {
        type: new GraphQLNonNull(GraphQLString),
      },
      wildcardUrl: {
        type: new GraphQLNonNull(GraphQLString),
      },
      type: {
        type: new GraphQLNonNull(StepAutoCompleteInteractionTypeEnumType),
      },
      elementSelector: {
        type: new GraphQLNonNull(GraphQLString),
      },
      elementText: {
        type: GraphQLString,
      },
      elementHtml: {
        type: GraphQLString,
      },
    },
  });

const StepPrototypeCtaInputType = new GraphQLInputObjectType({
  name: 'StepPrototypeCtaInput',
  fields: {
    entityId: {
      type: EntityId,
    },
    text: {
      type: new GraphQLNonNull(GraphQLString),
    },
    url: {
      type: GraphQLString,
    },
    type: {
      type: new GraphQLNonNull(StepCtaTypeEnumType),
    },
    style: {
      type: new GraphQLNonNull(StepCtaStyleEnumType),
    },
    destinationGuide: {
      type: GraphQLString,
    },
    settings: {
      type: StepCtaSettingsInputType,
    },
  },
});

export const StepPrototypeInputType = new GraphQLInputObjectType({
  name: 'StepPrototypeInput',
  fields: {
    entityId: {
      type: EntityId,
    },
    name: {
      type: GraphQLString,
    },
    body: {
      type: GraphQLString,
    },
    bodySlate: {
      type: GraphQLJSON,
    },
    eventName: {
      type: GraphQLString,
      deprecationReason: 'Use eventMappings',
    },
    stepType: {
      type: StepTypeEnumType,
    },
    mediaReferences: {
      type: new GraphQLList(new GraphQLNonNull(MediaReferenceInputType)),
    },
    completeForWholeAccount: {
      type: GraphQLBoolean,
      deprecationReason: 'Use eventMappings',
    },
    stepEventMappingRules: {
      type: new GraphQLList(new GraphQLNonNull(StepEventMappingRuleInputType)),
      deprecationReason: 'Use eventMappings',
    },
    eventMappings: {
      type: new GraphQLList(new GraphQLNonNull(StepEventMappingInputType)),
    },
    autoCompleteInteractions: {
      type: new GraphQLList(
        new GraphQLNonNull(AutoCompleteInteractionInputType)
      ),
    },
    dismissLabel: {
      type: GraphQLString,
    },
    branchingQuestion: {
      type: GraphQLString,
    },
    branchingMultiple: {
      type: GraphQLBoolean,
    },
    branchingDismissDisabled: {
      type: GraphQLBoolean,
    },
    branchingEntityType: {
      type: BranchingEntityEnumType,
    },
    branchingPathData: {
      type: new GraphQLList(new GraphQLNonNull(BranchingPathInputType)),
    },
    branchingFormFactor: {
      type: BranchingFormFactorEnumType,
    },
    inputs: InputFieldFactoryListInput,
    ctas: {
      type: new GraphQLList(new GraphQLNonNull(StepPrototypeCtaInputType)),
    },
    autoCompleteInteraction: {
      type: StepPrototypeAutoCompleteInteractionInputType,
    },
    manualCompletionDisabled: {
      type: GraphQLBoolean,
    },
    snappyAt: {
      type: GraphQLDateTime,
    },
    taggedElements: {
      type: new GraphQLList(new GraphQLNonNull(EditTaggedElementInputType)),
    },
  },
});

export const ModuleInputType = new GraphQLInputObjectType({
  name: 'EditModuleModuleData',
  fields: {
    entityId: {
      type: EntityId,
    },
    name: {
      type: GraphQLString,
    },
    /** @todo remove after D+14 */
    displayTitle: {
      type: GraphQLString,
      deprecationReason: 'Use `name` instead. This wont have any effect rn',
    },
    description: {
      type: GraphQLString,
    },
    stepPrototypes: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(StepPrototypeInputType))
      ),
    },
  },
});
