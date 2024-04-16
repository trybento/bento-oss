import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { graphql } from 'react-relay';
import omit from 'lodash/omit';
import { Box } from '@chakra-ui/react';
import { Formik, FormikConfig } from 'formik';

import { GuideFormFactor, Theme } from 'bento-common/types';
import { guideNameOrFallback } from 'bento-common/utils/naming';
import { PROPAGATION_COUNT_THRESHOLD } from 'bento-common/utils/constants';
import { roundToPSTHour } from 'bento-common/utils/dates';

import useToast from 'hooks/useToast';
import Link from 'system/Link';
import QueryRenderer from 'components/QueryRenderer';
import TemplateForm from '../TemplateForm';
import AttributesProvider from 'providers/AttributesProvider';
import TemplateProvider from 'providers/TemplateProvider';
import TemplatePropagationQueueQuery from 'queries/TemplatePropagationQueueQuery';

import * as EditTemplateMutation from 'mutations/EditTemplate';
import { EditTemplateQuery } from 'relay-types/EditTemplateQuery.graphql';

import {
  prepareTemplateData,
  sanitizeModuleData,
  sanitizeTagsData,
} from 'helpers';
import { EditTemplateFormRanks } from 'helpers/constants';
import { getIsAnyStepAutoCompleteRuleIncomplete } from 'components/StepAutoCompletion/helpers';
import { EditTemplateTemplateInput } from 'relay-types/EditTemplateMutation.graphql';
import { TemplateFormValues } from '../Template';
import { showErrors } from 'utils/helpers';
import TopBreadcrumbs from '../../common/Breadcrumbs';
import FormsProvider from 'providers/FormsProvider';
import AllModulesProvider from 'providers/AllModulesProvider';
import AllTemplatesProvider from 'providers/AllTemplatesProvider';
import CustomApiEventsProvider from 'providers/CustomApiEventsProvider';
import { FormEntityType } from 'components/GuideForm/types';
import BlockingCallout from '../BlockingCallout';
import { useOrganization } from 'providers/LoggedInUserProvider';
import useNextFocus from 'hooks/useNextFocus';
import { useGuideSchedulingThrottling } from 'hooks/useFeatureFlag';
import { timestampFormatter } from '../Tabs/templateTabs.helpers';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';
import { GuideResetToastProvider } from 'components/GuideResetToast';

type EditTemplateQueryResponse = EditTemplateQuery['response'];

interface EditTemplateProps extends EditTemplateQueryResponse {
  stepPrototypeEntityId: string;
  refetch: () => void;
}
export type TemplateForm = EditTemplateQuery['response']['template'];

export interface TemplateFormProps {
  query: EditTemplateQuery['response'];
  lastSavedAt: string;
  initialSelectedStepPrototype?: string;
  refetch: () => void;
}

interface ContainerProps {
  templateEntityId: string;
  stepPrototypeEntityId?: string;
}

function EditTemplate(props: EditTemplateProps) {
  useNextFocus();

  const {
    template,
    stepPrototypeEntityId,
    autoLaunchableTemplates,
    launchedNpsSurveys,
  } = props;
  const {
    organization: { controlSyncing },
  } = useOrganization();
  const throttlingEnabled = useGuideSchedulingThrottling();
  const propagationPoll = useRef<NodeJS.Timer>();
  const [isPropagating, setIsPropagating] = useState(false);
  const enabledPrivateNames = useInternalGuideNames();

  /* TODO: Fix typing */
  const templateData = prepareTemplateData(template) as any;

  const formProps: Omit<TemplateFormProps, 'refetch'> = {
    query: props,
    lastSavedAt: template.editedAt as string,
  };

  const toast = useToast();

  // Keep track and disable reinitialize for external actions if dirty.
  const [reinitializeEnabled, setReinitializeEnabled] = useState<boolean>(true);

  const handleFormDirty = useCallback((dirty: boolean) => {
    setReinitializeEnabled(!dirty);
  }, []);

  const handleSave = useCallback<FormikConfig<TemplateFormValues>['onSubmit']>(
    async ({ templateData }) => {
      try {
        const allStepPrototypes = templateData.modules.flatMap((module) => {
          return module.stepPrototypes;
        });

        if (getIsAnyStepAutoCompleteRuleIncomplete(allStepPrototypes as any)) {
          toast({
            title: 'Step auto-complete properties cannot be empty',
            isClosable: true,
            status: 'error',
          });

          return;
        }

        /** @todo fix breaking types */
        // @ts-ignore ignoring for now, need to quiet non-impactful errors a bit
        const templateDataSanitized: EditTemplateTemplateInput = {
          ...omit(
            {
              ...templateData,
              inlineEmbed: templateData.inlineEmbed
                ? omit(templateData.inlineEmbed, ['template', 'targeting'])
                : null,
            },
            ['isCyoa', 'formFactor', 'isSideQuest', 'designType']
          ),
          taggedElements: sanitizeTagsData(templateData.taggedElements),
          modules: templateData.modules.map((mod) =>
            sanitizeModuleData(
              mod,
              templateData.theme as Theme,
              template.formFactor as GuideFormFactor
            )
          ),
        };

        const response = await EditTemplateMutation.commit({
          templateData: templateDataSanitized,
        });

        void getIsPropagating();

        const result = response && response.editTemplate;
        if (!result) {
          throw new Error('Something went wrong');
        }
        setReinitializeEnabled(true);

        toast({
          title: 'Saved!',
          isClosable: true,
          status: 'success',
        });

        props.refetch();

        return true;
      } catch (e) {
        showErrors(e, toast);
      }

      return false;
    },
    [template.formFactor]
  );

  const guideReleaseTime = useMemo(
    () =>
      template.enableAutoLaunchAt &&
      roundToPSTHour(3, new Date(template.enableAutoLaunchAt)),
    [template.enableAutoLaunchAt]
  );

  const inPurgatory = useMemo(
    () =>
      throttlingEnabled &&
      template.isAutoLaunchEnabled &&
      new Date() <= guideReleaseTime,
    [throttlingEnabled, template.isAutoLaunchEnabled, guideReleaseTime]
  );

  /**
   * @todo consider removing the treatment for the propagation queue
   */
  const getIsPropagating = useCallback(async () => {
    const res = await TemplatePropagationQueueQuery({
      templateEntityId: template.entityId,
    });

    if (!res.template) return;

    setIsPropagating(res.template.propagationQueue > 0);
  }, [template.entityId]);

  const blockEditing = useMemo(
    () =>
      (controlSyncing &&
        isPropagating &&
        template.propagationCount > PROPAGATION_COUNT_THRESHOLD) ||
      inPurgatory,
    [controlSyncing, isPropagating, inPurgatory, template.propagationCount]
  );

  useEffect(() => {
    if (blockEditing && !propagationPoll.current) {
      propagationPoll.current = setInterval(() => {
        void getIsPropagating();
      }, 5000);
    } else {
      if (propagationPoll.current) {
        clearTimeout(propagationPoll.current);
        propagationPoll.current === undefined;
      }
    }
  }, [blockEditing]);

  const validate = useCallback((values: TemplateFormValues) => {
    const errors: Record<string, string> = {};

    for (const moduleData of values.templateData.modules) {
      if (moduleData.stepPrototypes.length === 0)
        errors.moduleData = 'At least one step is required per module';
    }

    return errors;
  }, []);

  return (
    <>
      <Box>
        <TopBreadcrumbs
          trail={[
            { label: 'Library', path: '/library' },
            { label: 'Guides', path: '/library?tab=guides' },
            {
              label: guideNameOrFallback(
                enabledPrivateNames
                  ? template.privateName || template.name
                  : template.name
              ),
            },
          ]}
        />
      </Box>
      <BlockingCallout isOpen={blockEditing}>
        ⚠️ This template can not be edited while{' '}
        {inPurgatory ? (
          <>
            it is being prepared for launch. This will be complete at{' '}
            {timestampFormatter.format(guideReleaseTime)}.
          </>
        ) : (
          <>changes are syncing. This can take a few minutes.</>
        )}{' '}
        Click{' '}
        <Link color="blue.500" href="/library">
          here
        </Link>{' '}
        to return to your library.
      </BlockingCallout>
      <AttributesProvider>
        <Box>
          <FormsProvider
            formRankings={EditTemplateFormRanks}
            refetch={props.refetch}
            rootFormDetails={{
              formEntityType: FormEntityType.template,
              entityId: template.entityId,
            }}
          >
            <Formik
              validate={validate}
              initialValues={{
                templateData,
                updatedAt: template.editedAt,
              }}
              onSubmit={handleSave}
              /**
               * Disable reinitialize for external
               * actions if form is dirty.
               */
              enableReinitialize={reinitializeEnabled}
            >
              <AllModulesProvider>
                <AllTemplatesProvider>
                  <CustomApiEventsProvider>
                    <TemplateProvider
                      template={template}
                      autoLaunchableTemplates={autoLaunchableTemplates}
                      launchedNpsSurveys={launchedNpsSurveys}
                      onFormDirty={handleFormDirty}
                    >
                      <TemplateForm
                        {...formProps}
                        initialSelectedStepPrototype={stepPrototypeEntityId}
                        refetch={props.refetch}
                      />
                    </TemplateProvider>
                  </CustomApiEventsProvider>
                </AllTemplatesProvider>
              </AllModulesProvider>
            </Formik>
          </FormsProvider>
          <Box height="40px" />
        </Box>
      </AttributesProvider>
    </>
  );
}

/** Populates TemplateProvider */
const EDIT_TEMPLATE = graphql`
  query EditTemplateQuery($templateEntityId: EntityId!) {
    template: findTemplate(entityId: $templateEntityId) {
      entityId
      name
      privateName
      isCyoa
      isTemplate
      state
      description
      launchedAt
      stoppedAt
      type
      theme
      isTargetedForSplitTesting
      propagationQueue
      propagationCount
      formFactor
      inlineEmbed {
        ...InlineEmbed_inlineEmbedWithTemplateId @relay(mask: false)
      }
      formFactorStyle {
        ...Guide_formFactorStyle @relay(mask: false)
      }
      isSideQuest
      designType
      archivedAt
      expireBasedOn
      expireAfter
      pageTargetingType
      pageTargetingUrl
      notificationSettings {
        ...Guide_notificationSettings @relay(mask: false)
      }
      taggedElements {
        ...EditTag_taggedElement @relay(mask: false)
      }
      modules {
        name
        displayTitle
        description
        isCyoa
        entityId
        templates {
          entityId
        }
        stepPrototypes {
          name
          entityId
          snappyAt
          body
          bodySlate
          stepType
          manualCompletionDisabled
          autoCompleteInteractions {
            ...StepAutoComplete_autoCompleteInteractions @relay(mask: false)
          }
          eventMappings {
            eventName
            completeForWholeAccount
            rules {
              propertyName
              valueType
              ruleType
              numberValue
              textValue
              booleanValue
              dateValue
            }
          }
          branchingQuestion
          branchingMultiple
          branchingDismissDisabled
          branchingFormFactor
          branchingKey
          branchingChoices {
            label
            choiceKey
            style {
              ...StepBranching_style @relay(mask: false)
            }
          }
          branchingPaths {
            choiceKey
            entityType
            templateEntityId
            template {
              entityId
            }
            moduleEntityId
            module {
              entityId
            }
          }
          ctas {
            ...Cta_stepPrototypeCta @relay(mask: false)
          }
          taggedElements(templateEntityId: $templateEntityId) {
            ...EditTag_taggedElement @relay(mask: false)
          }
          mediaReferences {
            ...Media_stepMedia @relay(mask: false)
          }
          autoCompleteInteraction {
            url
            type
            wildcardUrl
            elementSelector
            elementText
            elementHtml
          }
          inputs {
            entityId
            label
            type
            settings {
              ...StepInput_settings @relay(mask: false)
            }
          }
        }
      }
      isAutoLaunchEnabled
      enableAutoLaunchAt
      disableAutoLaunchAt
      priorityRanking
      splitSources {
        entityId
        name
      }
      hasAutoLaunchedGuideBases
      hasGuideBases
      targetingSet
      splitTargets {
        name
        privateName
      }
      editedAt
      ...TemplateOverflowMenuButton_template
      ...Template_targets @relay(mask: false)
    }
    autoLaunchableTemplates: templates(
      autoLaunchableOnly: true
      category: all
    ) {
      ...RankableObjects_templates @relay(mask: false)
    }
    launchedNpsSurveys: npsSurveys(launched: true) {
      ...RankableObjects_surveys @relay(mask: false)
    }
  }
`;

export default function EditTemplateQueryRenderer(cProps: ContainerProps) {
  const { templateEntityId, stepPrototypeEntityId } = cProps;

  return (
    <QueryRenderer<EditTemplateQuery>
      query={EDIT_TEMPLATE}
      variables={{
        templateEntityId,
      }}
      render={({ props, retry }) => {
        if (props) {
          return (
            <GuideResetToastProvider>
              <EditTemplate
                {...props}
                stepPrototypeEntityId={stepPrototypeEntityId}
                refetch={retry}
              />
            </GuideResetToastProvider>
          );
        }
      }}
    />
  );
}
