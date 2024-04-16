import React, { useCallback, useState } from 'react';
import { graphql } from 'react-relay';
import { useRouter } from 'next/router';
import { capitalizeFirstLetter } from 'bento-common/utils/strings';
import useToast from 'hooks/useToast';
import * as EditModuleMutation from 'mutations/EditModule';
import QueryRenderer from 'components/QueryRenderer';
import AttributesProvider from 'providers/AttributesProvider';
import { getIsAnyStepAutoCompleteRuleIncomplete } from 'components/StepAutoCompletion/helpers';
import ModuleForm, { ModuleFormValues } from './ModuleForm';
import { EditModuleQuery } from 'relay-types/EditModuleQuery.graphql';
import { sanitizeModuleData } from 'helpers';
import { showErrors } from 'utils/helpers';
import { MODULE_ALIAS_SINGULAR } from 'helpers/constants';
import AllModulesProvider from 'providers/AllModulesProvider';
import AllTemplatesProvider from 'providers/AllTemplatesProvider';
import CustomApiEventsProvider from 'providers/CustomApiEventsProvider';
import { useOrganization } from 'providers/LoggedInUserProvider';
import BlockingCallout from 'components/Templates/BlockingCallout';
import { getAutoLaunchMutationArgs } from 'components/GuideAutoLaunchModal/Template/autolaunch.helpers';
import pick from 'lodash/pick';
import { PROPAGATION_COUNT_THRESHOLD } from 'bento-common/utils/constants';
import { moduleNotFound } from 'components/EditorCommon/common';
import { BranchingType } from 'bento-common/types/templateData';
import InlineLink from 'components/common/InlineLink';

const CAPPED_ALIAS = capitalizeFirstLetter(MODULE_ALIAS_SINGULAR);

type EditModuleQueryResponse = EditModuleQuery['response'];

interface Props extends EditModuleQueryResponse {
  onRefetch?: () => void;
}

interface ContainerProps {
  moduleEntityId: string;
}

function EditModule(props: Props) {
  const { module, onRefetch } = props;
  const toast = useToast();
  const router = useRouter();
  const {
    organization: { controlSyncing },
  } = useOrganization();

  const [wasAnyElementSaved, setWasAnyElementSaved] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const blockEditing =
    controlSyncing &&
    module.propagationQueue > 0 &&
    module.propagationCount > PROPAGATION_COUNT_THRESHOLD;

  const handleSave = useCallback(
    async ({ moduleData, targetingData }: ModuleFormValues) => {
      try {
        if (
          getIsAnyStepAutoCompleteRuleIncomplete(
            moduleData.stepPrototypes as any
          )
        ) {
          toast({
            title: 'Step auto-complete properties cannot be empty',
            isClosable: true,
            status: 'error',
          });

          return;
        }

        const sanitizedModuleData = sanitizeModuleData(moduleData);

        const sanitizedTargetingData = targetingData.map(
          ({ targetTemplate, autoLaunchContext }) => ({
            targetTemplate,
            autoLaunchRules: getAutoLaunchMutationArgs({
              ...pick(autoLaunchContext, [
                'accountGroupCondition',
                'accountUserGroupCondition',
                'accountRules',
                'accountTargetType',
                'accountUserRules',
                'accountUserTargetType',
              ]),
              templateEntityId: null,
            }).autoLaunchRules,
          })
        );

        await EditModuleMutation.commit({
          moduleData: sanitizedModuleData as any /* TODO: fickss */,
          targetingData: sanitizedTargetingData,
        });

        setWasAnyElementSaved(false);

        toast({
          title: 'Saved!',
          isClosable: true,
          status: 'success',
        });

        onRefetch?.();
      } catch (e) {
        showErrors(e, toast);
      }
    },
    [onRefetch]
  );

  const handleNewElementFromBranching = useCallback(
    (branchingEntityType: BranchingType) => {
      setWasAnyElementSaved(true);

      toast({
        title:
          branchingEntityType === BranchingType.guide
            ? 'Template created!'
            : `${CAPPED_ALIAS} created!`,
        isClosable: true,
        status: 'success',
      });

      // Update available modules array.
      onRefetch?.();
    },
    [onRefetch]
  );

  const onDeleted = useCallback(() => {
    setIsDeleting(true);
    router.push('/library/step-groups');
  }, [router]);

  if (!module && !isDeleting) {
    moduleNotFound(router, toast);
    return null;
  }

  return (
    <AllModulesProvider>
      <AllTemplatesProvider>
        <CustomApiEventsProvider>
          <BlockingCallout isOpen={blockEditing}>
            ⚠️ This module can not be edited while changes are syncing. This can
            take ~5 min. Click <InlineLink label="here" href="/library" /> to
            return to your library.
          </BlockingCallout>
          <AttributesProvider>
            <ModuleForm
              query={props}
              onSave={handleSave}
              onDeleted={onDeleted}
              handleNewElementFromBranching={handleNewElementFromBranching}
              wasAnyElementSaved={wasAnyElementSaved}
              numberOfTemplatesUsingModule={module.templates.length}
            />
          </AttributesProvider>
        </CustomApiEventsProvider>
      </AllTemplatesProvider>
    </AllModulesProvider>
  );
}

const EDIT_MODULE_QUERY = graphql`
  query EditModuleQuery($moduleEntityId: EntityId!) {
    module: findModule(entityId: $moduleEntityId) {
      name
      displayTitle
      entityId
      lastEdited {
        timestamp
      }
      templates {
        entityId
      }
      propagationQueue
      propagationCount
      stepPrototypes {
        name
        entityId
        snappyAt
        body
        bodySlate
        stepType
        manualCompletionDisabled
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
          template {
            entityId
          }
          module {
            entityId
          }
        }
        ctas {
          ...Cta_stepPrototypeCta @relay(mask: false)
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
      targetingData {
        targetTemplate
        autoLaunchRules {
          ruleType
          rules
        }
      }
    }
  }
`;

export default function EditModuleQueryRenderer(cProps: ContainerProps) {
  const { moduleEntityId } = cProps;
  const toast = useToast();
  const router = useRouter();

  return (
    <QueryRenderer<EditModuleQuery>
      query={EDIT_MODULE_QUERY}
      variables={{
        moduleEntityId,
      }}
      render={({ props, retry, error }) => {
        if (props && props.module) {
          return <EditModule {...props} onRefetch={retry} />;
        } else if (error) {
          moduleNotFound(router, toast);
        }
      }}
    />
  );
}
