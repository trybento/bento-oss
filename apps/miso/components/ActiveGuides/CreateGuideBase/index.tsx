import React, { useState } from 'react';
import { graphql } from 'react-relay';
import Checkbox from 'system/Checkbox';
import { useTable, useSortBy, CellProps, TableState } from 'react-table';
import { useRouter } from 'next/router';
import useToast from 'hooks/useToast';
import Box from 'system/Box';
import Button from 'system/Button';
import TableRenderer, { BentoLoadingSpinner } from 'components/TableRenderer';
import AttributesProvider from 'providers/AttributesProvider';
import QueryRenderer from 'components/QueryRenderer';
import { CreateGuideBaseQuery } from 'relay-types/CreateGuideBaseQuery.graphql';
import { launchGuideBase } from './createGuideBases.helpers';
import useRecordState from 'hooks/useRecordState';
import {
  GuideComponentColumn,
  getMultiSortFormatted,
  NameColumn,
  NAME_COL_WIDTH,
  ScopeColumn,
  SCOPE_COL_WIDTH,
  TableType,
  LayoutColumn,
} from 'components/TableRenderer/tables.helpers';
import { SplitTestState } from 'bento-common/types';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';
import Page from 'components/layout/Page';
import ConfirmLaunchGuideBasesModal from './ConfirmLaunchGuideBasesModal';
import useToggleState from 'hooks/useToggleState';

type Template = CreateGuideBaseQuery['response']['templates'][number];
type CreateGuideBaseQueryResponse = CreateGuideBaseQuery['response'];

interface TemplateWithIsUsed extends Template {
  inUse: boolean;
  inUseGuideBase: CreateGuideBaseQueryResponse['account']['guideBases'][number];
}
interface ContainerProps {
  accountEntityId: string;
  templateEntityId?: string;
}

interface Props extends CreateGuideBaseQueryResponse, ContainerProps {}

const templatesToEmptyState = (
  templates: CreateGuideBaseQuery['response']['templates'],
  defaultValue: any
) =>
  templates.reduce((a, v) => {
    a[v.entityId] = defaultValue;
    return a;
  }, {} as any);

function CreateGuideBase(props: Props) {
  const { templates = [], account } = props;
  const toast = useToast();
  const router = useRouter();
  const modalStates = useToggleState(['confirmLaunch']);
  const [loading, setLoading] = useState(false);

  const [selectedTemplateEntityIds, setSelectedTemplateEntityIds] =
    useRecordState<boolean>(templatesToEmptyState(templates, false));
  const enabledInternalNames = useInternalGuideNames();

  const isFormValid = React.useMemo(
    () =>
      Object.keys(selectedTemplateEntityIds).some(
        (id) => selectedTemplateEntityIds[id]
      ),
    [selectedTemplateEntityIds]
  );

  const constructNewState = React.useCallback(
    (templateEntityId: string) => {
      const selected = !selectedTemplateEntityIds[templateEntityId];
      setSelectedTemplateEntityIds(templateEntityId, selected);
    },
    [selectedTemplateEntityIds]
  );

  const handleSelectTemplate = React.useCallback(
    (templateEntityId: string) => () => {
      constructNewState(templateEntityId);
    },
    [selectedTemplateEntityIds]
  );

  const handleLaunch = async () => {
    try {
      setLoading(true);

      const templatesToLaunch = Object.entries(selectedTemplateEntityIds)
        .filter(([, selected]) => selected)
        .map(([entityId]) => entityId);

      for (const templateEntityId of templatesToLaunch) {
        await launchGuideBase({
          accountEntityId: account.entityId,
          templateEntityId,
        });
      }

      router.push(`/customers/${account.entityId}/guides`);

      toast({
        title: `Your ${
          templatesToLaunch.length === 1 ? 'guide has' : 'guides have'
        } been launched!`,
        isClosable: true,
        status: 'success',
      });

      modalStates.confirmLaunch.off();
    } catch {
      toast({
        title: 'Something went wrong',
        isClosable: true,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const data = React.useMemo(
    () =>
      templates
        .filter(
          (template) =>
            !template.isTemplate &&
            (template.isTargetedForSplitTesting === SplitTestState.none ||
              template.isTargetedForSplitTesting === SplitTestState.stopped)
        )
        .map((template) => {
          const inUseGuideBase = account.guideBases.find(
            (guideBase) =>
              guideBase.createdFromTemplate?.entityId === template.entityId
          );

          return {
            ...template,
            inUse: !!inUseGuideBase,
            inUseGuideBase,
          };
        }),
    [templates]
  ) as TemplateWithIsUsed[];

  const columns = React.useMemo(
    () => [
      {
        Header: ' ',
        id: 'CHECKBOX_COL',
        Cell: (cellData: CellProps<TemplateWithIsUsed>) => {
          const template = cellData.row.original;

          if (template.inUse) return null;

          return (
            <Box display="flex" justifyContent="center">
              <Checkbox
                isChecked={selectedTemplateEntityIds[template.entityId]}
                onChange={handleSelectTemplate(template.entityId)}
              />
            </Box>
          );
        },
      },
      NameColumn<TemplateWithIsUsed>({ enabledInternalNames }),
      ScopeColumn<TemplateWithIsUsed>(),
      GuideComponentColumn<TemplateWithIsUsed>(),
      LayoutColumn<TemplateWithIsUsed>(),
    ],
    [templates, selectedTemplateEntityIds, enabledInternalNames]
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: getMultiSortFormatted(TableType.launchGuides),
      } as Partial<TableState>,
    },
    useSortBy
  );

  return (
    <Page
      title="Launch guides"
      breadcrumbs={[
        { label: 'Customers', path: '/customers' },
        {
          label: `${account.name}`,
          path: `/customers/${account.entityId}`,
        },
        {
          label: 'Guides',
          path: `/customers/${account.entityId}?tab/guides`,
        },
      ]}
      actions={
        <Button
          my={[4, 'auto']}
          ml={[0, 'auto']}
          mr={['auto', 0]}
          isDisabled={!account?.entityId || !isFormValid}
          onClick={modalStates.confirmLaunch.on}
        >
          Launch
        </Button>
      }
    >
      <TableRenderer
        type={TableType.launchGuides}
        tableInstance={tableInstance}
        gridTemplateColumns={`
        75px
        390px
        ${SCOPE_COL_WIDTH}
        140px
        minmax(100px, 0.9fr)
      `}
      />
      <ConfirmLaunchGuideBasesModal
        isOpen={modalStates.confirmLaunch.isOn}
        onClose={modalStates.confirmLaunch.off}
        onConfirm={handleLaunch}
        loading={loading}
      />
    </Page>
  );
}

export default function CreateGuideBaseQueryRenderer(cProps: ContainerProps) {
  const { accountEntityId } = cProps;

  return (
    <QueryRenderer<CreateGuideBaseQuery>
      query={graphql`
        query CreateGuideBaseQuery($accountEntityId: EntityId!) {
          account: findAccount(entityId: $accountEntityId) {
            name
            entityId
            externalId
            guideBases {
              createdFromTemplate {
                entityId
              }
            }
            ...TemplateOption_account
          }
          templates {
            type
            isTemplate
            entityId
            isCyoa
            name
            privateName
            isTargetedForSplitTesting
            isAutoLaunchEnabled
            state
            formFactor
            formFactorStyle {
              ...Guide_formFactorStyle @relay(mask: false)
            }
            theme
            designType
            modules {
              hasBranchingStep
              hasInputStep
            }
            isSideQuest
            ...TemplateOption_template
          }
        }
      `}
      variables={{
        accountEntityId,
      }}
      render={({ props }) => (
        <AttributesProvider>
          {props ? (
            <CreateGuideBase {...cProps} {...props} />
          ) : (
            <BentoLoadingSpinner size={TABLE_SPINNER_SIZE} />
          )}
        </AttributesProvider>
      )}
    />
  );
}
