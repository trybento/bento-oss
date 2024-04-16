import { sanitizeSlateBody } from 'bento-common/components/RichTextEditor/helpers';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import {
  AtLeast,
  BannerPosition,
  BannerTypeEnum,
  BentoEvents,
  BranchingEntityType,
  CtaInput,
  FormFactorStyle,
  GuideDesignType,
  GuideExpirationCriteria,
  GuideFormFactor,
  GuidePageTargetingType,
  GuideTypeEnum,
  StepCtaType,
  StepInputFieldInput,
  StepType,
  TagInput,
  Theme,
} from 'bento-common/types';
import {
  getImplicitStepCtas,
  isBranchingStep,
  isBranchingTypeSupported,
} from 'bento-common/data/helpers';
import { moduleNameOrFallback } from 'bento-common/utils/naming';

import { EditGuideBaseGuideBaseInput } from 'relay-types/EditGuideBaseMutation.graphql';

import { BranchingFormFactor, ModuleOption } from 'types';
import {
  GuideTypeLabels,
  MODULE_ALIAS_SINGULAR,
  NO_MODULE_PLACEHOLDER,
} from './constants';
import { isBranching } from 'utils/helpers';
import { TemplateForm } from 'components/Templates/EditTemplate';
import { EditModule_Module } from 'components/Modules/types';
import { MediaReferenceInput } from 'bento-common/types/media';
import { BranchingType, TemplateValue } from 'bento-common/types/templateData';
import { isFakeId } from 'bento-common/data/fullGuide';
import {
  ClientStorage,
  readFromClientStorage,
  removeFromClientStorage,
  saveToClientStorage,
} from 'bento-common/utils/clientStorage';

const DEFAULT_BRANCHING_TYPE = BranchingType.module;
const DEFAULT_BRANCHING_FORM_FACTOR = BranchingFormFactor.Dropdown;

export const NEW_MODULE_OPTION: ModuleOption = {
  value: '',
  label: `+ Create a new ${MODULE_ALIAS_SINGULAR}`,
};

type GenericStepWithBranchingPaths = AtLeast<
  { branchingPaths: any[]; stepType: StepType },
  'branchingPaths' | 'stepType'
>;

export const getBranchingTypeFromStep = (
  step: GenericStepWithBranchingPaths | undefined
): BranchingEntityType | undefined => {
  return step?.branchingPaths?.[0]?.entityType;
};

export const getBranchingTypesInModule = (
  module: AtLeast<
    {
      stepPrototypes: GenericStepWithBranchingPaths[];
    },
    'stepPrototypes'
  >
): string[] => {
  return Object.keys(
    (module.stepPrototypes || []).reduce((acc, s) => {
      if (isBranchingStep(s.stepType)) {
        const type = getBranchingTypeFromStep(s);
        if (type) {
          acc[type] = true;
        }
      }
      return acc;
    }, {})
  );
};

export const prepareTaggedElements = (
  taggedElements: TagInput[] | undefined
) => {
  return (taggedElements || []).map((te) => ({ ...te }));
};

/**
 * Used to prepare stepPrototype branching data.
 * @param stepPrototype StepPrototype
 */
export const prepareStepPrototypeBranchingAttrs = (stepPrototype) => {
  const keyedBranchingChoices = keyBy(
    stepPrototype?.branchingChoices || [],
    'choiceKey'
  );

  return {
    branchingQuestion: stepPrototype?.branchingQuestion || '',
    branchingMultiple: stepPrototype?.branchingMultiple || false,
    branchingDismissDisabled: stepPrototype?.branchingDismissDisabled || false,
    branchingFormFactor:
      stepPrototype?.branchingFormFactor || DEFAULT_BRANCHING_FORM_FACTOR,
    branchingEntityType:
      getBranchingTypeFromStep(stepPrototype) || DEFAULT_BRANCHING_TYPE,
    branchingPathData:
      stepPrototype?.branchingPaths?.map((bp) => ({
        label: keyedBranchingChoices?.[bp.choiceKey]?.label,
        choiceKey: bp.choiceKey,
        templateEntityId: bp.template?.entityId,
        moduleEntityId:
          !bp.module && bp.entityType === 'module'
            ? NO_MODULE_PLACEHOLDER
            : bp.module?.entityId,
        style: keyedBranchingChoices?.[bp.choiceKey]?.style,
      })) || [],
  };
};

/**
 * Used to prepare NEW step data.
 * @param step Step
 */
export const prepareNewGuideBaseStepData = (step, theme?: Theme) => {
  return attrsFromStandardStep(step, theme, {
    body: undefined,
    entityId: null,
    createdFromStepPrototypeEntityId: step.entityId,
    branchingQuestion: step.branchingQuestion,
    branchingKey: step.entityId,
    branchingChoices: step.branchingChoices,
    branchingFormFactor: step.branchingFormFactor,
    branchingMultiple: step.branchingMultiple,
    branchingDismissDisabled: step.branchingDismissDisabled,
  });
};

/**
 * Used to prepare NEW module data.
 * @param module Module
 */
export const prepareNewGuideBaseModuleData = (module, theme: Theme) => {
  return {
    name: module.name,
    createdFromModuleEntityId: module.entityId,
    steps: module.stepPrototypes.map((sp) =>
      prepareNewGuideBaseStepData(sp, theme)
    ),
  };
};

/**
 * Used to prepare stepPrototype data.
 * @param stepPrototype StepPrototype
 */
export const prepareStepPrototypeData = (stepPrototype, theme?: Theme) => {
  return attrsFromStandardStep(stepPrototype, theme, {
    eventMappings: stepPrototype.eventMappings,
    inputs: stepPrototype.inputs,
    snappyAt: stepPrototype.snappyAt,
    autoCompleteInteraction: stepPrototype.autoCompleteInteraction,
    autoCompleteInteractions: stepPrototype.autoCompleteInteractions,
    manualCompletionDisabled: stepPrototype?.manualCompletionDisabled,
    ...prepareStepPrototypeBranchingAttrs(stepPrototype),
  });
};

/**
 * Used to prepare templateModule data.
 * @param templateModule TemplateModule
 */
export const prepareTemplateModuleData = (templateModule, theme?: Theme) => {
  return {
    name: templateModule.name || templateModule.displayTitle,
    isCyoa: templateModule.isCyoa,
    entityId: templateModule.entityId,
    stepPrototypes: templateModule.stepPrototypes.map((m) =>
      prepareStepPrototypeData(m, theme)
    ),
    displayTitle: templateModule.displayTitle,
    description: templateModule.description,
  };
};

function getDefaultFormFactorStyle(
  formFactor: GuideFormFactor
): FormFactorStyle {
  switch (formFactor) {
    case GuideFormFactor.banner:
      return {
        bannerType: BannerTypeEnum.floating,
        bannerPosition: BannerPosition.top,
      };
    default:
      return undefined;
  }
}

/** Patch CYOA data for a template's prepared data. */
const patchCyoaData = (data: ReturnType<typeof prepareTemplateData>) => {
  if (!data.isCyoa) return;

  /** @todo fix typing. Quieting now for focus */
  // @ts-ignore
  const cyoaStep: ReturnType<typeof prepareStepPrototypeData> &
    ReturnType<typeof prepareStepPrototypeBranchingAttrs> =
    data.modules[0].stepPrototypes[0];

  if (!cyoaStep.branchingPathData.length) {
    cyoaStep.branchingEntityType = BranchingType.guide;
    cyoaStep.branchingFormFactor = BranchingFormFactor.Cards;
  }

  return;
};

/**
 * Used to prepare module data.
 * @param module EditModule_Module
 */
export const prepareModuleData = (module: EditModule_Module) => {
  return {
    name: module.name,
    displayTitle: module.name,
    entityId: module.entityId,
    stepPrototypes: module.stepPrototypes.map((sp) =>
      prepareStepPrototypeData(sp)
    ),
  };
};

/**
 * Transforms query data from server into Formik data format.
 * @param template Template
 */
export const prepareTemplateData = (template: TemplateForm) => {
  const data: TemplateValue = {
    entityId: template.entityId,
    isCyoa: template.isCyoa,
    name: template.name,
    privateName: template.privateName,
    description: template.description,
    formFactor: template.formFactor as GuideFormFactor,
    designType: template.designType as GuideDesignType,
    pageTargetingType: template.pageTargetingType as GuidePageTargetingType,
    pageTargetingUrl: template.pageTargetingUrl,
    theme: template.theme as Theme,
    isSideQuest: template.isSideQuest,
    inlineEmbed: template.inlineEmbed,
    enableAutoLaunchAt: template.enableAutoLaunchAt,
    disableAutoLaunchAt: template.disableAutoLaunchAt,
    notificationSettings: template.notificationSettings,
    expireBasedOn: template.expireBasedOn as GuideExpirationCriteria,
    expireAfter: template.expireAfter,
    type: template.type as GuideTypeEnum,
    modules: template.modules.map((m) =>
      prepareTemplateModuleData(m, template.theme as Theme)
    ),
    formFactorStyle: (template.formFactorStyle ||
      getDefaultFormFactorStyle(
        template.formFactor as GuideFormFactor
      )) as FormFactorStyle,
    taggedElements: prepareTaggedElements(template.taggedElements as any),
  };

  patchCyoaData(data);

  return data;
};

/**
 * Filter allowed modules for a template. Additional
 * options may be passed for additional filtering.
 */
export const filterAllowedModules = (
  moduleOptions: ModuleOption[],
  templateData: TemplateValue,
  theme: Theme | undefined,
  isCyoa: boolean | undefined
) => {
  /** Modules that are already saved. */
  const templateDataModuleEntityIds = templateData.modules
    .map((m) => m?.entityId)
    .filter(Boolean);

  return [
    ...moduleOptions.filter((moduleOption) => {
      // Ignore module if already in template.
      if (templateDataModuleEntityIds.includes(moduleOption.value)) {
        return false;
      }

      // Check if all branching types are supported.
      return (moduleOption?.meta?.branchingTypes || []).every((bt) =>
        isBranchingTypeSupported({
          entityType: bt as BranchingEntityType,
          theme,
          isCyoa,
        })
      );
    }),
  ];
};

export const concatImplicitCtas = ({
  implicitCtas,
  ctas,
  allowedTypes,
}: {
  implicitCtas: CtaInput[];
  ctas: CtaInput[];
  /** Pass only if you need to filter allowed types. */
  allowedTypes?: StepCtaType[];
}): CtaInput[] => {
  const includedCtaTypes: Record<string, boolean> = (ctas || []).reduce(
    (acc, cta) => {
      acc[cta.type] = true;
      return acc;
    },
    {}
  );

  return implicitCtas
    .filter((icta) => !includedCtaTypes[icta.type])
    .concat(
      ctas.reduce((acc, cta) => {
        if (!allowedTypes || allowedTypes.includes(cta.type)) {
          const defaultImplicit = implicitCtas.find(
            (icta) => icta.type === cta.type
          );
          const useDefaultImplicit = !cta.settings.implicit && defaultImplicit;

          acc.push(
            useDefaultImplicit
              ? defaultImplicit
              : {
                  ...cta,
                  settings: {
                    ...cta.settings,
                    implicit: !!defaultImplicit,
                  },
                }
          );
        }
        return acc;
      }, [] as CtaInput[])
    );
};

/**
 * Used in prepare data methods to centralize all the basic properties
 *  Properties common to all the hierarchy of objects relating to Steps
 * @param step StepPrototype, Step or GuideStepBase
 * @param extraProps Replace or add keys
 */
export const attrsFromStandardStep = (step, theme?: Theme, extraProps = {}) => {
  const implicitCtas = getImplicitStepCtas({
    stepType: step.stepType,
    branchingMultiple: step.branchingMultiple,
    branchingType: step.branchingPaths?.[0]?.entityType,
  });

  return {
    entityId: step?.entityId as string,
    name: step?.name as string,
    body: step?.body as string,
    bodySlate: sanitizeSlateBody(
      step?.bodySlate,
      step?.stepType as StepType,
      theme
    ),
    mediaReferences: step.mediaReferences as MediaReferenceInput[],
    taggedElements: prepareTaggedElements(step?.taggedElements),
    stepType: step?.stepType as StepType,
    dismissLabel: step?.dismissLabel,
    ctas:
      step?.ctas?.length !== undefined
        ? concatImplicitCtas({ implicitCtas, ctas: step.ctas })
        : undefined,
    inputs: step?.inputs,
    manualCompletionDisabled: step?.manualCompletionDisabled,
    ...extraProps,
  };
};

export const sanitizeTagsData = (tags: TagInput[] | undefined | null) => {
  if (!tags) return tags;

  return tags.map((t) => ({
    ...t,
    entityId: isFakeId(t.entityId) ? null : t.entityId,
  }));
};

export const sanitizeInputsData = (
  inputs: StepInputFieldInput[] | undefined | null
) => {
  if (!inputs) return inputs;

  return inputs.map((input) => ({
    ...input,
    entityId: isFakeId(input.entityId) ? null : input.entityId,
  }));
};

export const sanitizeCtasData = (ctas: CtaInput[] | undefined | null) => {
  if (!ctas) return ctas;

  return ctas.map((cta) => ({
    ...cta,
    entityId: isFakeId(cta.entityId) ? null : cta.entityId,
  }));
};

/** Remove placeholders that allow empty module branching destionations */
const sanitizeBranchingPathData = (
  branchingPathData: {
    choiceKey: string;
    label: string;
    moduleEntityId: string;
    templateEntityId: string;
  }[]
) =>
  branchingPathData.map((bpd) => ({
    ...bpd,
    moduleEntityId:
      bpd.moduleEntityId === NO_MODULE_PLACEHOLDER
        ? undefined
        : bpd.moduleEntityId,
  }));

const editGuideBaseInputKeys: (keyof EditGuideBaseGuideBaseInput)[] = [
  'name',
  'description',
  'modules',
];
/** GraphQL does not want certain data in its guide base stuff or it will cry */
export const sanitizeGuideBaseData = (data): EditGuideBaseGuideBaseInput => {
  if (!data) return { name: '', modules: [] };

  const allowedData = pick(data, editGuideBaseInputKeys);

  return {
    ...allowedData,
    modules: data?.modules?.map((m) => ({
      ...m,
      steps: m?.steps?.map((s) =>
        omit(s, [
          'branchingEntityType',
          'branchingFormFactor',
          'manualCompletionDisabled',
          'branchingKey',
          'branchingMultiple',
          'branchingDismissDisabled',
          'branchingPathData',
          'branchingQuestion',
          'branchingChoices',
          'ctas',
          'mediaReferences',
          'taggedElements',
          'inputs',
        ])
      ),
    })),
  };
};

/**
 * Need to do this because plucking needs to include it to update UI
 * however since UI does not set Context ID, we can't send it with the save data
 */
export const sanitizeStepData = (
  step,
  theme: Theme,
  formFactor?: GuideFormFactor
) => {
  let sanitizedStep;

  switch (formFactor) {
    case GuideFormFactor.modal:
    case GuideFormFactor.banner: {
      const { ...restStep } = step || {};
      sanitizedStep = restStep;
      break;
    }

    default: {
      const { dismissLabel, branchingChoices, branchingPaths, ...restStep } =
        step || {};
      sanitizedStep = restStep;
      break;
    }
  }

  const eventName =
    (step.eventName === BentoEvents.account ||
      step.eventName === BentoEvents.user) &&
    (step.eventMappings || []).length === 0
      ? undefined
      : step.eventName;

  const entityId = isFakeId(sanitizedStep.entityId)
    ? null
    : sanitizedStep.entityId;

  return {
    ...sanitizedStep,
    entityId,
    bodySlate: sanitizeSlateBody(
      sanitizedStep.bodySlate,
      sanitizedStep.stepType,
      theme
    ),
    ...(isBranching(sanitizedStep.stepType) && {
      branchingEntityType:
        sanitizedStep.branchingEntityType || DEFAULT_BRANCHING_TYPE,
      branchingPathData: sanitizeBranchingPathData(
        step.branchingPathData || []
      ),
    }),
    eventName,
    taggedElements: sanitizeTagsData(sanitizedStep.taggedElements),
    inputs: sanitizeInputsData(sanitizedStep.inputs),
    ctas: sanitizeCtasData(sanitizedStep.ctas),
  };
};

export const sanitizeModuleData = (
  module,
  theme?: Theme,
  formFactor?: GuideFormFactor
) => {
  return {
    ...omit(module, ['isCyoa']),
    entityId: isFakeId(module.entityId) ? null : module.entityId,
    stepPrototypes: module?.stepPrototypes.map((s) =>
      sanitizeStepData(s, theme, formFactor)
    ),
  };
};

/**
 * Determine if stepPrototype has auto-complete by data enabled.
 */
export const getIsStepAutoCompletionEnabled = (stepPrototype) => {
  return (
    !!stepPrototype?.eventMappings?.length ||
    !!stepPrototype?.autoCompleteInteractions?.length
  );
};

/**
 * Determine if stepPrototype has auto-complete by interaction enabled.
 */
export const getIsStepAutoCompleteInteractionEnabled = (stepPrototype) =>
  stepPrototype && stepPrototype.autoCompleteInteraction;

/** Redirect URL to something without sent-in-queries */
export const removeUrlQueries = () =>
  window.history.replaceState(null, null, window.location.pathname);

/** Remove query elements from the url, preserving what isn't targeted. */
export const removeQueryFromUrl = (query: string | string[]) => {
  const url = new URL(window.location.href);
  Array.isArray(query)
    ? query.forEach((q) => url.searchParams.delete(q))
    : url.searchParams.delete(query);
  window.history.pushState({}, document.title, url);
};

export const getQueryParam = (search: string) => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(search);
};

/**
 * WARNING: The /embed routes shouldn't ever persist URL, otherwise we run the risk of
 * unintentionally redirecting the user from within `setLoggedInUserResponse`, and that
 * would cause the WYSIWYG toolbar to keep reloading in a weird loop.
 */
const shouldPreserveUrl = () =>
  !['/trial-ended', '/reset-password', '/start-trial', '/login', '/embed'].some(
    (path) => window.location.href.includes(path)
  );

const REDIRECT_KEY = 'redirectAfterLogin';

/**
 * Handles redirecting based on session states
 *
 * The primary use case is to preserve links after going through th authentication flow, in
 *   case a user is trying to access an authenticated path while logged out.
 */
export const SessionRedirect = {
  /** Set a redirect URL we want to target */
  set: (url: string) => {
    if (shouldPreserveUrl()) {
      saveToClientStorage<string>(
        ClientStorage.sessionStorage,
        REDIRECT_KEY,
        url
      );
    }
  },
  /** Redirect to any cached URL after we've done the login flow */
  call: () => {
    const redirectAfterLogin = readFromClientStorage<string>(
      ClientStorage.sessionStorage,
      REDIRECT_KEY
    );
    if (redirectAfterLogin) {
      SessionRedirect.clear();
      window.location.assign(redirectAfterLogin);
    }
  },
  /** Clear targeted redirect URLs for any reason */
  clear: () => {
    removeFromClientStorage(ClientStorage.sessionStorage, REDIRECT_KEY);
  },
};

export function getModuleOptions(
  modules: readonly {
    [key: string]: any;
    readonly entityId: string;
    readonly displayTitle: string;
    readonly name: string;
    readonly description: string;
    readonly stepPrototypes: readonly any[];
  }[],
  includeMeta: {
    branchingTypes?: boolean;
  } = {}
): ModuleOption[] {
  return modules.map((module) => {
    const meta: ModuleOption['meta'] = {};

    // Add branching types included in the module.
    if (includeMeta?.branchingTypes) {
      meta.branchingTypes = getBranchingTypesInModule(module as any);
    }

    return {
      value: module.entityId,
      label: moduleNameOrFallback(module),
      description: module.description,
      meta,
    };
  });
}

export function getGuideTypeString(templateType: GuideTypeEnum, add?: string) {
  if (templateType === GuideTypeEnum.template) {
    return GuideTypeLabels[templateType];
  }
  return `${GuideTypeLabels[templateType]} ${add}`;
}

export function saveCSV(filename: string, csvContent: string) {
  const useBlob = true;
  const fileName = `${filename}.csv`;
  const data = encodeURI(
    useBlob ? csvContent : `data:text/csv;charset=utf-8,${csvContent}`
  );
  const link = document.createElement('a');

  const blob = new Blob(['\ufeff', csvContent]);
  const url = URL.createObjectURL(blob);

  document.body.appendChild(link);
  link.setAttribute('href', useBlob ? url : data);
  link.setAttribute('download', fileName);
  link.click();
  document.body.removeChild(link);
}

export function getDesignTypeString(designType: GuideDesignType) {
  switch (designType) {
    case GuideDesignType.announcement:
      return 'Announcement';
    case GuideDesignType.everboarding:
      return 'Contextual guide';
    default:
      return 'New user checklist';
  }
}

export function isAbsoluteUrl(url: string) {
  return (
    typeof url === 'string' &&
    (url.indexOf('://') > 0 || url.indexOf('//') === 0)
  );
}

/**
 * Useful when you simply want the first value of a named query parameter,
 * instead of maybe receiving a list of values.
 */
export function firstQueryParam(
  value: string | string[] | undefined
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Check if Mac. appVersion is deprecated but used ass fallback */
export const isMac = () =>
  ((navigator as any).userAgentData?.platform
    ? (navigator as any).userAgentData.platform
    : navigator.appVersion
  )
    .toLowerCase()
    .indexOf('mac') != -1;

export const readFileDataAsText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result as string;
      resolve(data);
    };

    reader.onerror = reject;

    reader.readAsText(file);
  });
