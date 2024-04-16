import React, { useMemo } from 'react';
import {
  useTable,
  useSortBy,
  CellProps,
  TableState,
  TableOptions,
} from 'react-table';
import TableRenderer from 'components/TableRenderer';
import { TableType } from 'components/TableRenderer/tables.helpers';
import { GuideAnalyticsQuery } from 'relay-types/GuideAnalyticsQuery.graphql';
import { stepNameOrFallback } from 'bento-common/utils/naming';
import { Box, Flex, Link } from '@chakra-ui/react';
import CallSplitOutlinedIcon from '@mui/icons-material/CallSplitOutlined';
import { GuideTypeEnum } from 'bento-common/types';
import { pluralize } from 'bento-common/utils/pluralize';
import { getPercentage } from 'bento-common/data/helpers';

type Props = {
  moduleBranchingStepPrototypes: GuideAnalyticsQuery['response']['template']['modules'][number]['stepPrototypes'];
  detachedBranchingStepPerformance: GuideAnalyticsQuery['response']['template']['branchingPerformance'];
  guideType: GuideTypeEnum;
  isCyoa: boolean;
};

type TableProps = {
  module: Props['moduleBranchingStepPrototypes'][number]['branchingPerformance'][number]['createdModule'];
};

type StepPrototype = TableProps['module']['stepPrototypes'][number];

export default function TemplateBranchingPerformance({
  moduleBranchingStepPrototypes,
  detachedBranchingStepPerformance,
  guideType,
  isCyoa,
}: Props) {
  const objLabel = guideType === GuideTypeEnum.account ? 'account' : 'user';

  return (
    <Flex
      p="6"
      border="1px solid #E3E8F0"
      borderRadius="lg"
      flex="1"
      overflowY="auto"
      flexDir="column"
      gap="4"
    >
      {moduleBranchingStepPrototypes.map((sp) => (
        <Flex flexDir="column" w="full" gap="4">
          <Flex fontSize="md" fontWeight="bold" gap="2" color="black">
            <Box color="gray.600">
              <CallSplitOutlinedIcon style={{ width: '16px' }} />
            </Box>

            {stepNameOrFallback(sp.name)}
          </Flex>
          {sp.branchingPerformance.map((bp) => {
            // Consider "no step group" path.
            return bp.createdModule ? (
              <Flex flexDir="column">
                <Flex fontSize="sm">
                  <Link
                    href={`/library/step-groups/${bp.createdModule.entityId}`}
                    target="_blank"
                  >
                    {bp.createdModule.displayTitle}
                  </Link>
                  <Box ml="auto">
                    {bp.triggeredCount} {pluralize(bp.triggeredCount, objLabel)}
                  </Box>
                </Flex>
                <TemplateBranchingPerformanceTable module={bp.createdModule} />
              </Flex>
            ) : (
              <Flex fontSize="sm">
                <Box>{bp.choiceText || 'No step group'}</Box>
                <Box ml="auto">
                  {bp.triggeredCount} {pluralize(bp.triggeredCount, objLabel)}
                </Box>
              </Flex>
            );
          })}
        </Flex>
      ))}
      {detachedBranchingStepPerformance.length > 0 && (
        <Flex flexDir="column" w="full" gap="4">
          {!isCyoa && (
            <Flex fontSize="md" fontWeight="bold" gap="2" color="black">
              Removed or changed options
            </Flex>
          )}
          {detachedBranchingStepPerformance.map((m) =>
            m.createdModule ? (
              <Flex flexDir="column">
                <Flex fontSize="sm">
                  <Link
                    href={`/library/step-groups/${m.createdModule.entityId}`}
                    target="_blank"
                  >
                    {m.createdModule.displayTitle}
                  </Link>
                  <Box ml="auto">
                    {m.count} {pluralize(m.count, objLabel)}
                  </Box>
                </Flex>
                {m.count > 1 &&
                  m.createdModule.stepPrototypes[0].stepCompletionStats
                    ?.stepsCompleted !== 0 && (
                    <TemplateBranchingPerformanceTable
                      module={m.createdModule}
                    />
                  )}
              </Flex>
            ) : m.createdTemplate ? (
              <Flex fontSize="sm">
                <Link
                  href={`/library/templates/${m.createdTemplate.entityId}?tab=analytics`}
                  target="_blank"
                >
                  {m.createdTemplate.name}
                </Link>
                <Box ml="auto">
                  {m.count} {pluralize(m.count, objLabel)}
                </Box>
              </Flex>
            ) : null
          )}
        </Flex>
      )}
    </Flex>
  );
}

function TemplateBranchingPerformanceTable({ module }: TableProps) {
  const data = useMemo(() => module.stepPrototypes, [module]);

  const columns = useMemo(
    () => [
      {
        Header: 'Step added',
        id: 'name',
        canSort: true,
        Cell: (cellData: CellProps<StepPrototype>) => {
          const stepPrototype = cellData.row.original;
          return <>{stepNameOrFallback(stepPrototype.name)}</>;
        },
      },
      {
        Header: 'Completion rate',
        id: 'completionRate',
        // TODO: Add sorting.
        canSort: false,
        Cell: (cellData: CellProps<StepPrototype>) => {
          const stepPrototype = cellData.row.original;
          return (
            <>
              {getPercentage(
                stepPrototype.stepCompletionStats.stepsCompleted,
                stepPrototype.stepCompletionStats.totalSteps
              )}
            </>
          );
        },
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {} as Partial<TableState>,
    } as unknown as TableOptions<object>,
    useSortBy
  );

  return (
    <TableRenderer
      type={TableType.libraryTemplates}
      tableInstance={tableInstance}
      centeredCols={['completionRate']}
      cellPaddingX="20px"
      gridTemplateColumns={`
        minmax(200px, 1fr)
        200px
      `}
      mt="2"
      headerBoxProps={{
        shadow: '0px 1px 0px rgb(0 0 0 / 6%)',
      }}
    />
  );
}
