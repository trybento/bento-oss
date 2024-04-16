import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import useToast from 'hooks/useToast';
import { useRouter } from 'next/router';
import { FormFactorStyle, GuideBaseState, Theme } from 'bento-common/types';
import { isGuideInActiveSplitTest } from 'bento-common/data/helpers';

import Box from 'system/Box';
import Button from 'system/Button';
import QueryRenderer from 'components/QueryRenderer';
import OrgUsersDropdown from 'components/OrgUsersDropdown';
import CurrentAccountProvider from 'providers/CurrentAccountProvider';
import AttributesProvider from 'providers/AttributesProvider';

import { subscribe as GuideBaseChanged } from 'subscriptions/GuideBaseChanged';
import { commit as LaunchGuideBase } from 'mutations/LaunchGuideBase';
import { commit as AssignPrimaryContactToAccount } from 'mutations/AssignPrimaryContactToAccount';
import { commit as UnassignPrimaryContactFromAccount } from 'mutations/UnassignPrimaryContactFromAccount';

import EditUserGuideBaseForm, { GuideValue } from './EditUserGuideBaseForm';

import { EditUserGuideBase_guideBase$data } from 'relay-types/EditUserGuideBase_guideBase.graphql';
import { EditUserGuideBase_organization$data } from 'relay-types/EditUserGuideBase_organization.graphql';
import GuideBaseOverflowMenuButton from 'components/ActiveGuides/ActiveGuidesTable/GuideBaseOverflowMenuButton';
import PersistedGuideBaseProvider from 'providers/PersistedGuideBaseProvider';
import { EditGuideBaseGuideBaseInput } from 'relay-types/EditGuideBaseMutation.graphql';
import { StepValue } from 'types';
import {
  AutoCompletableStepEntityIds,
  GuideBase,
  GuideModuleBase,
  GuideStepBase,
  StepBases,
} from './types';
import {
  attrsFromStandardStep,
  prepareStepPrototypeBranchingAttrs,
} from 'helpers';
import { submitEditGuideBaseMutation } from '../../GuideBases/EditGuideBase/guideBase.helpers';
import TopBreadcrumbs from '../../common/Breadcrumbs';
import AllModulesProvider from 'providers/AllModulesProvider';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { guidePrivateOrPublicNameOrFallback } from 'bento-common/utils/naming';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';
import { FormikProps } from 'formik';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';
import { EditUserGuideBaseQuery } from 'relay-types/EditUserGuideBaseQuery.graphql';
import {
  GuideResetToastProvider,
  useGuideResetToast,
} from 'components/GuideResetToast';

interface ContainerProps {
  guideBaseEntityId: string;
}

interface Props extends ContainerProps {
  guideBase: EditUserGuideBase_guideBase$data;
  organization: EditUserGuideBase_organization$data;
  onRefetch: () => void;
}

const assignPrimaryContactAdditionalOptions = [
  {
    label: 'None',
    value: 'none',
  },
];

const prepareGuideData = (guideBase: GuideBase | undefined) => {
  if (!guideBase) return {};

  const autoCompletableStepEntityIds: AutoCompletableStepEntityIds = {};
  const stepBases: StepBases = {};

  const prepareGuideStepBaseData = (guideStepBase: GuideStepBase) => {
    const usersCompleted = guideStepBase?.usersCompleted || [];
    const entityId = guideStepBase.entityId;
    autoCompletableStepEntityIds[entityId] =
      guideStepBase.createdFromStepPrototype?.isAutoCompletable;
    stepBases[entityId] = {
      steps: guideStepBase?.steps,
      usersViewed: guideStepBase?.usersViewed,
      usersCompleted: usersCompleted,
      countUsersCompleted: usersCompleted.length,
      percentageCompleted: 0, // Not displayed, so query removed to save resource
    };

    return attrsFromStandardStep(guideStepBase, guideBase.theme as Theme, {
      body: undefined,
      entityId: entityId,
      createdFromStepPrototypeEntityId:
        guideStepBase.createdFromStepPrototype?.entityId,
      ...prepareStepPrototypeBranchingAttrs(guideStepBase),
    });
  };

  const prepareGuideModuleBaseData = (guideModuleBase: GuideModuleBase) => {
    return {
      name: guideModuleBase.name,
      entityId: guideModuleBase.entityId,
      createdFromModuleEntityId: guideModuleBase.createdFromModule?.entityId,
      steps: guideModuleBase.guideStepBases.map(
        prepareGuideStepBaseData
      ) as StepValue[],
    };
  };

  return {
    guideData: {
      name: guideBase.name,
      modules: guideBase.guideModuleBases.map((guideModuleBase) =>
        prepareGuideModuleBaseData(guideModuleBase)
      ),
      formFactorStyle: guideBase.formFactorStyle as FormFactorStyle,
      pageTargetingType: guideBase.pageTargetingType,
    },
    autoCompletableStepEntityIds,
    stepBases,
  };
};

function EditUserGuideBase({ organization, guideBase, onRefetch }: Props) {
  useEffect(() => {
    if (!guideBase) return;
    const subscription = GuideBaseChanged({
      guideBaseEntityId: guideBase.entityId,
    });

    return () => {
      subscription.dispose();
    };
  }, [guideBase]);

  const currentPrimaryContactEntityId =
    guideBase?.account?.primaryContact?.entityId;
  const toast = useToast();
  const router = useRouter();
  const [formData, setFormData] =
    useState<FormikProps<{ guideData: GuideValue }>>();
  const launchGuideRef = useRef(null);
  const enabledPrivateNames = useInternalGuideNames();
  const templateEntityId = guideBase.createdFromTemplate.entityId;
  const { runAutoCheck } = useGuideResetToast();

  useEffect(() => {
    runAutoCheck('guide_base', [guideBase.entityId]);
  }, []);

  const guideModuleBaseParticipantsCount = useMemo(
    () =>
      Object.fromEntries(
        guideBase.guideModuleBases.map((gmb) => [
          gmb.entityId,
          new Set<string>(
            gmb.guideStepBases.flatMap((gsb) =>
              (gsb.usersViewed || []).map((gsb) => gsb.email)
            )
          ).size,
        ])
      ),
    [guideBase.guideModuleBases]
  );

  const { guideData, autoCompletableStepEntityIds, stepBases } = useMemo(
    () => prepareGuideData(guideBase),
    [guideBase]
  );

  const handleSave = useCallback(
    async ({ guideData }: { guideData: GuideValue }) => {
      try {
        await submitEditGuideBaseMutation({
          guideBaseEntityId: guideBase.entityId,
          /** @todo revisit since this does not make sense */
          data: {
            ...guideData,
            modules: guideData.modules,
          } as EditGuideBaseGuideBaseInput,
        });

        onRefetch?.();

        toast({
          title: 'Saved!',
          isClosable: true,
          status: 'success',
        });
      } catch (err) {
        let errorMsg = 'Something went wrong';
        if (err.length) {
          errorMsg = err.reduce((acc, msg) => (acc ? ', ' : '') + msg, '');
        }

        toast({
          title: errorMsg,
          isClosable: true,
          status: 'error',
        });
      }
    },
    [guideBase.entityId]
  );

  const handleLaunch = useCallback(
    async ({ guideData }: { guideData: GuideValue }) => {
      const _guideData = {
        ...guideData,
        modules: guideData.modules,
      };

      try {
        await submitEditGuideBaseMutation({
          guideBaseEntityId: guideBase.entityId,
          data: _guideData as EditGuideBaseGuideBaseInput,
        });

        const response = await LaunchGuideBase({
          guideBaseEntityId: guideBase.entityId,
        });

        const guideBaseFromResponse = response.launchGuideBase?.guideBase;
        if (!guideBaseFromResponse) {
          throw new Error('Something went wrong');
        }

        if (guideBaseFromResponse.type === 'account') {
          const accountGuideEntityId =
            guideBaseFromResponse.accountGuide?.entityId;
          if (!accountGuideEntityId) {
            throw new Error('Something went wrong');
          }

          router.push(`/guides/${accountGuideEntityId}`);
        }

        let targetingSuccessMsg;
        if (guideBase.state === 'draft') {
          targetingSuccessMsg = 'Saved and launched!';
        } else {
          targetingSuccessMsg = 'Targeting saved!';

          onRefetch && onRefetch();
        }

        toast({
          title: targetingSuccessMsg,
          isClosable: true,
          status: 'success',
        });
      } catch {
        toast({
          title: 'Something went wrong',
          isClosable: true,
          status: 'error',
        });
      }
    },
    [guideBase]
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
  }, [guideBase]);

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
    [currentPrimaryContactEntityId, guideBase]
  );

  const handlePrimaryContactChange = useCallback(
    (userEntityId: string) => {
      if (userEntityId === 'none') {
        handleUnassignPrimaryContact();
      } else {
        handleAssignPrimaryContact(userEntityId);
      }
    },
    [handleAssignPrimaryContact, handleUnassignPrimaryContact]
  );

  const handleSubmitForm = useCallback(() => {
    formData?.submitForm();
  }, [formData]);

  const bindLaunchGuide = useCallback((launchGuideHandler) => {
    launchGuideRef.current = launchGuideHandler;
  }, []);

  const handleViewTemplate = useCallback(() => {
    window.open(`/library/templates/${templateEntityId}`, '_blank');
  }, [templateEntityId]);

  if (!guideBase) return null;

  const isArchived = guideBase.state === GuideBaseState.archived;
  const isReadonly =
    isArchived ||
    isGuideInActiveSplitTest(guideBase.isTargetedForSplitTesting as any);

  const headerControls = (
    <Box display="flex" alignItems="center" gap="4">
      <Box w={['100px', '150px', '240px']}>
        <OrgUsersDropdown
          // @ts-ignore
          users={organization.users}
          onChange={handlePrimaryContactChange}
          selectedValue={guideBase.account.primaryContact?.entityId || 'none'}
          disabled={isReadonly}
          additionalOptions={assignPrimaryContactAdditionalOptions}
        />
      </Box>
      <Box display="flex" gap={2} alignItems="center">
        {!isReadonly && (
          <Button
            onClick={handleSubmitForm}
            isDisabled={!formData?.dirty || !formData.isValid}
          >
            Update
          </Button>
        )}
        <Button variant="secondary" onClick={handleViewTemplate}>
          View template
        </Button>
        {!isReadonly && (
          <GuideBaseOverflowMenuButton
            onRefetch={onRefetch}
            guideBase={guideBase as any}
            accountEntityId={guideBase.account.entityId}
          />
        )}
      </Box>
    </Box>
  );

  return (
    <Box position="relative">
      <Box px="16" pt="8">
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
              label: guidePrivateOrPublicNameOrFallback(
                enabledPrivateNames,
                guideBase.createdFromTemplate
              ),
            },
          ]}
        />
      </Box>

      <AttributesProvider>
        <CurrentAccountProvider accountEntityId={guideBase.account.entityId}>
          <AllModulesProvider>
            <PersistedGuideBaseProvider guideBase={guideBase as any}>
              <EditUserGuideBaseForm
                guideData={guideData}
                guideBaseState={guideBase.state as GuideBaseState}
                isCyoa={guideBase.isCyoa}
                stepBases={stepBases}
                autoCompletableStepEntityIds={autoCompletableStepEntityIds}
                guideModuleBaseParticipantsCount={
                  guideModuleBaseParticipantsCount
                }
                bindFormData={setFormData}
                onSave={handleSave}
                bindLaunchGuide={bindLaunchGuide}
                onLaunch={handleLaunch}
                renderHeaderControls={headerControls}
                theme={guideBase.theme as Theme}
              />
            </PersistedGuideBaseProvider>
          </AllModulesProvider>
        </CurrentAccountProvider>
      </AttributesProvider>
    </Box>
  );
}

const EditUserGuideBaseFragmentContainer = createFragmentContainer(
  EditUserGuideBase,
  {
    guideBase: graphql`
      fragment EditUserGuideBase_guideBase on GuideBase {
        entityId
        account {
          entityId
          name
          primaryContact {
            entityId
          }
        }
        wasAutoLaunched
        state
        isCyoa
        name
        isSideQuest
        isModifiedFromTemplate
        theme
        isTargetedForSplitTesting
        type
        createdFromTemplate {
          entityId
          name
          privateName
        }
        pageTargetingType
        formFactor
        formFactorStyle {
          ...Guide_formFactorStyle @relay(mask: false)
        }
        designType
        participantsCount
        participantsWhoViewedCount
        guides {
          entityId
        }
        guideModuleBases {
          name
          entityId
          orderIndex
          dynamicallyAddedByStep {
            entityId
            name
          }
          createdFromModule {
            entityId
          }
          guideStepBases {
            name
            entityId
            body
            orderIndex
            stepType
            bodySlate
            dismissLabel
            branchingQuestion
            branchingMultiple
            branchingDismissDisabled
            branchingPaths {
              entityType
            }
            usersViewed {
              fullName
              email
            }
            usersCompleted {
              fullName
              email
            }
            createdFromStepPrototype {
              entityId
              isAutoCompletable
            }
            steps {
              entityId
              stepType
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
    `,
    organization: graphql`
      fragment EditUserGuideBase_organization on Organization {
        name
        users {
          ...OrgUsersDropdown_users
        }
      }
    `,
  }
);

const EDIT_USER_GUIDE_BASE_QUERY = graphql`
  query EditUserGuideBaseQuery($entityId: EntityId!) {
    guideBase: findGuideBase(entityId: $entityId) {
      ...EditUserGuideBase_guideBase
    }
    organization {
      ...EditUserGuideBase_organization
    }
  }
`;

export default function EditUserGuideBaseQueryRenderer(cProps: ContainerProps) {
  const { guideBaseEntityId } = cProps;
  if (!guideBaseEntityId) return null;

  return (
    <QueryRenderer<EditUserGuideBaseQuery>
      query={EDIT_USER_GUIDE_BASE_QUERY}
      variables={{
        entityId: guideBaseEntityId,
      }}
      render={({ props, retry }) =>
        props && props.guideBase && props.organization ? (
          <GuideResetToastProvider>
            {/** @ts-ignore */}
            <EditUserGuideBaseFragmentContainer
              {...cProps}
              guideBase={props.guideBase}
              organization={props.organization}
              onRefetch={retry}
            />
          </GuideResetToastProvider>
        ) : (
          <BentoLoadingSpinner size={TABLE_SPINNER_SIZE} />
        )
      }
    />
  );
}
