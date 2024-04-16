import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { graphql } from 'react-relay';
import useToast from 'hooks/useToast';
import { FormikProps } from 'formik';

import Box from 'system/Box';
import Button from 'system/Button';
import QueryRenderer from 'components/QueryRenderer';
import OrgUsersDropdown from 'components/OrgUsersDropdown';
import CurrentAccountProvider from 'providers/CurrentAccountProvider';
import AttributesProvider from 'providers/AttributesProvider';

import { subscribe as GuideChanged } from 'subscriptions/GuideChanged';
import { subscribe as GuideBaseChanged } from 'subscriptions/GuideBaseChanged';
import { commit as AssignPrimaryContactToAccount } from 'mutations/AssignPrimaryContactToAccount';
import { commit as UnassignPrimaryContactFromAccount } from 'mutations/UnassignPrimaryContactFromAccount';
import EditAccountGuideBaseForm from './EditAccountGuideBaseForm';
import { EditGuideBaseGuideBaseInput } from 'relay-types/EditGuideBaseMutation.graphql';
import GuideBaseOverflowMenuButton from 'components/ActiveGuides/ActiveGuidesTable/GuideBaseOverflowMenuButton';
import { EditAccountGuideBaseQuery } from 'relay-types/EditAccountGuideBaseQuery.graphql';
import { GuideValue } from 'types';
import { GuideBase, GuideModuleBase, GuideStepBase } from './types';
import {
  attrsFromStandardStep,
  prepareStepPrototypeBranchingAttrs,
} from 'helpers';
import { submitEditGuideBaseMutation } from '../../GuideBases/EditGuideBase/guideBase.helpers';
import { GuideBaseState, Theme } from 'bento-common/types';
import { isGuideInActiveSplitTest } from 'bento-common/data/helpers';
import TopBreadcrumbs from '../../common/Breadcrumbs';
import PersistedGuideBaseProvider from 'providers/PersistedGuideBaseProvider';
import AllModulesProvider from 'providers/AllModulesProvider';
import { useUsers } from 'providers/UsersProvider';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { guideNameOrFallback } from 'bento-common/utils/naming';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';
import {
  GuideResetToastProvider,
  useGuideResetToast,
} from 'components/GuideResetToast';

type EditAccountGuideBaseQueryResponse = EditAccountGuideBaseQuery['response'];

interface Props extends EditAccountGuideBaseQueryResponse {
  onRefetch: () => void;
}

interface ContainerProps {
  guideBaseEntityId: string;
}

const assignPrimaryContactAdditionalOptions = [
  {
    label: 'None',
    value: 'none',
  },
];

const prepareGuideData = (guideBase: GuideBase) => ({
  name: guideBase.name,
  formFactorStyle: guideBase.formFactorStyle,
  modules: guideBase.guideModuleBases.map(
    (guideModuleBase: GuideModuleBase) => ({
      name: guideModuleBase.name,
      entityId: guideModuleBase.entityId,
      createdFromModuleEntityId: guideModuleBase.createdFromModule?.entityId,
      steps: guideModuleBase.guideStepBases.map(
        (guideStepBase: GuideStepBase) =>
          attrsFromStandardStep(guideStepBase, guideBase.theme as Theme, {
            body: undefined,
            entityId: guideStepBase.entityId,
            createdFromStepPrototypeEntityId:
              guideStepBase.createdFromStepPrototype?.entityId,
            ...prepareStepPrototypeBranchingAttrs(guideStepBase),
          })
      ),
    })
  ),
});

function EditAccountGuideBase({ guideBase, onRefetch }: Props) {
  const [formData, setFormData] = useState<
    FormikProps<{ guideData: GuideValue }> | undefined
  >();
  const currentPrimaryContactEntityId =
    guideBase.account.primaryContact?.entityId;
  const guide = guideBase.accountGuide;
  const toast = useToast();
  const { users } = useUsers();
  const templateEntityId = guideBase.createdFromTemplate.entityId;
  const { runAutoCheck } = useGuideResetToast();

  useEffect(() => {
    runAutoCheck('guide_base', [guideBase.entityId]);
  }, []);

  useEffect(() => {
    if (!guide?.entityId) return;
    const subscription = GuideChanged({
      guideEntityId: guide.entityId,
    });

    return () => void subscription.dispose();
  }, [guide?.entityId]);

  useEffect(() => {
    const subscription = GuideBaseChanged({
      guideBaseEntityId: guideBase.entityId,
    });

    return () => {
      subscription.dispose();
    };
  }, [guideBase.entityId]);

  const guideData = useMemo(
    () => prepareGuideData(guideBase) as unknown as GuideValue,
    [guideBase]
  );

  const accountGuideSteps = useMemo(
    () =>
      Object.fromEntries(
        guideBase.accountGuide.guideModules.flatMap((guideModule) =>
          guideModule.steps.map((step) => [
            step.createdFromStepPrototype.entityId,
            step,
          ])
        )
      ),
    [guideBase]
  );

  const handleSave = useCallback(
    async ({ guideData }: { guideData: GuideValue }) => {
      try {
        await submitEditGuideBaseMutation({
          guideBaseEntityId: guideBase.entityId,
          data: guideData as EditGuideBaseGuideBaseInput,
        });

        toast({
          title: 'Saved!',
          isClosable: true,
          status: 'success',
        });
      } catch (err) {
        const errorMsg = err.message || 'Something went wrong';

        toast({
          title: errorMsg,
          isClosable: true,
          status: 'error',
        });
      }
    },
    [guideBase.entityId]
  );

  const handleSubmitForm = useCallback(
    () => formData && handleSave(formData.values),
    [formData]
  );

  const handleUnassignPrimaryContact = useCallback(async () => {
    if (!currentPrimaryContactEntityId) return;

    await UnassignPrimaryContactFromAccount({
      accountEntityId: guideBase.account.entityId,
    });

    toast({
      title: 'The CSM for this account has been unassigned.',
      isClosable: true,
      status: 'success',
    });
  }, [currentPrimaryContactEntityId, guideBase.account.entityId]);

  const handleAssignPrimaryContact = useCallback(
    async (userEntityId: string) => {
      if (userEntityId === currentPrimaryContactEntityId) return;

      await AssignPrimaryContactToAccount({
        userEntityId,
        accountEntityId: guideBase.account.entityId,
      });

      toast({
        title: 'This CSM has been assigned to this account.',
        isClosable: true,
        status: 'success',
      });
    },
    [currentPrimaryContactEntityId, guideBase.account.entityId]
  );

  const handlePrimaryContactChange = useCallback((userEntityId: string) => {
    if (userEntityId === 'none') {
      handleUnassignPrimaryContact();
    } else {
      handleAssignPrimaryContact(userEntityId);
    }
  }, []);

  const handleViewTemplate = useCallback(() => {
    window.open(`/library/templates/${templateEntityId}`, '_blank');
  }, [templateEntityId]);

  const isArchived = guideBase.state === GuideBaseState.archived;
  const isReadonly =
    isArchived ||
    isGuideInActiveSplitTest(guideBase.isTargetedForSplitTesting as any);

  const headerControls = (
    <Box display="flex" alignItems="center" gap="4">
      <Box w={['100px', '150px', '240px']}>
        <OrgUsersDropdown
          // @ts-ignore
          users={users}
          onChange={handlePrimaryContactChange}
          selectedValue={guideBase.account.primaryContact?.entityId || 'none'}
          additionalOptions={assignPrimaryContactAdditionalOptions}
          disabled={isReadonly}
        />
      </Box>
      <Box display="flex" gap={2} alignItems="center">
        {!isReadonly && (
          <Button onClick={handleSubmitForm} isDisabled={!formData?.dirty}>
            Update
          </Button>
        )}
        <Button variant="secondary" onClick={handleViewTemplate}>
          View template
        </Button>
        {!isReadonly && (
          <GuideBaseOverflowMenuButton
            guideBase={guideBase as any}
            onRefetch={onRefetch}
            accountEntityId={guideBase.account.entityId}
          />
        )}
      </Box>
    </Box>
  );

  if (!guide) return null;

  return (
    <Box position="relative">
      <Box px="64px" pt="32px">
        <TopBreadcrumbs
          trail={[
            { label: 'Customers', path: '/customers' },
            {
              label: guideBase.account.name,
              path: `/customers/${guideBase.account.entityId}`,
            },
            {
              label: 'Guides',
              path: `/customers/${guideBase.account.entityId}/guides`,
            },
            {
              label: guideNameOrFallback(
                guideBase.createdFromTemplate.name || guideBase.name
              ),
            },
          ]}
        />
      </Box>

      <AttributesProvider>
        <CurrentAccountProvider accountEntityId={guideBase.account.entityId}>
          <PersistedGuideBaseProvider guideBase={guideBase as any}>
            <AllModulesProvider>
              <EditAccountGuideBaseForm
                guideData={guideData as GuideValue}
                guideBaseState={guideBase.state as GuideBaseState}
                isCyoa={guideBase.isCyoa}
                accountGuideSteps={accountGuideSteps}
                bindFormData={setFormData}
                onSave={handleSave}
                renderHeaderControls={headerControls}
                theme={guideBase.theme as Theme}
              />
            </AllModulesProvider>
          </PersistedGuideBaseProvider>
        </CurrentAccountProvider>
      </AttributesProvider>
    </Box>
  );
}

const EDIT_ACCOUNT_GUIDE_BASE_QUERY = graphql`
  query EditAccountGuideBaseQuery($entityId: EntityId!) {
    guideBase: findGuideBase(entityId: $entityId) {
      state
      entityId
      name
      theme
      formFactor
      isCyoa
      isTargetedForSplitTesting
      isModifiedFromTemplate
      type
      isSideQuest
      pageTargetingType
      formFactorStyle {
        ...Guide_formFactorStyle @relay(mask: false)
      }
      wasAutoLaunched
      accountGuide {
        entityId
        guideModules {
          entityId
          steps {
            name
            entityId
            body
            orderIndex
            completedAt
            completedByType
            stepType
            bodySlate
            isAutoCompletable
            usersViewed {
              fullName
              email
            }
            completedByUser {
              fullName
              email
            }
            completedByAccountUser {
              fullName
              email
            }
            createdFromStepPrototype {
              entityId
            }
          }
        }
      }
      createdFromTemplate {
        name
        entityId
      }
      guides {
        entityId
      }
      account {
        entityId
        name
        primaryContact {
          entityId
        }
      }
      guideModuleBases {
        name
        entityId
        orderIndex
        createdFromModule {
          entityId
        }
        guideStepBases {
          name
          entityId
          body
          orderIndex
          bodySlate
          stepType
          branchingQuestion
          branchingMultiple
          branchingDismissDisabled
          branchingPaths {
            entityType
          }
          createdFromStepPrototype {
            entityId
            isAutoCompletable
          }
          ctas {
            ...Cta_guideBaseStepCta @relay(mask: false)
          }
          mediaReferences {
            ...Media_stepMedia @relay(mask: false)
          }
          taggedElements {
            ...EditTag_taggedElementBase @relay(mask: false)
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
      ...GuideBaseOverflowMenuButton_guideBase @relay(mask: false)
    }
  }
`;

export default function EditAccountGuideBaseQueryRenderer(
  cProps: ContainerProps
) {
  const { guideBaseEntityId } = cProps;
  if (!guideBaseEntityId) return null;

  return (
    <QueryRenderer<EditAccountGuideBaseQuery>
      query={EDIT_ACCOUNT_GUIDE_BASE_QUERY}
      variables={{
        entityId: guideBaseEntityId,
      }}
      render={({ props, retry }) =>
        props ? (
          <GuideResetToastProvider>
            <EditAccountGuideBase {...props} onRefetch={retry} />
          </GuideResetToastProvider>
        ) : (
          <BentoLoadingSpinner size={TABLE_SPINNER_SIZE} />
        )
      }
    />
  );
}
