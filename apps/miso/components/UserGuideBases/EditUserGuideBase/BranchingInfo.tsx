import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Box, Text } from '@chakra-ui/react';
import { graphql } from 'react-relay';

import QueryRenderer from 'components/QueryRenderer';
import { BranchingInfoQuery } from 'relay-types/BranchingInfoQuery.graphql';
import { TableLoadingSpinner } from 'components/TableRenderer';
import UsersCountCell from 'components/UsersCountCell';
import Tooltip from 'system/Tooltip';

interface ContainerProps {
  isOpen: boolean;
  guideStepBaseEntityId: string;
}

type BranchingInfoQueryResponse = BranchingInfoQuery['response'];

interface Props extends BranchingInfoQueryResponse {}

const branchingOptionsColFlex = '1';
export const stepStatColWidth = '200px';

/**
 * WARNING: This can have huge performance implications for high traffic guides.
 */
function BranchingInfo({ guideStepBaseInfo }: Props) {
  return (
    <Box display="flex" flexDir="column">
      <Box display="flex">
        <Text
          textAlign="left"
          fontSize="sm"
          fontWeight="bold"
          color="gray.700"
          flex={branchingOptionsColFlex}
        >
          Branching Options
        </Text>
        <Box textAlign="center" color="gray.600" w={stepStatColWidth}>
          <Tooltip label="Users who have selected this option" placement="top">
            Users selected
          </Tooltip>
        </Box>
      </Box>
      {guideStepBaseInfo?.map((stepChoice, i) => {
        const showUnderline = i < guideStepBaseInfo.length - 1;
        return (
          <Box
            // Temporarily hidding border
            // borderBottom={showUnderline ? '1px solid' : null}
            // borderBottomColor="gray.200"
            textAlign="center"
            display="flex"
            py="2"
          >
            <Text
              textAlign="left"
              color="#1a202c"
              fontSize="14px"
              overflow="hidden"
              textOverflow="ellipsis"
              title={stepChoice.choiceLabel}
              flex={branchingOptionsColFlex}
            >
              <Text ml="2">{stepChoice.choiceLabel}</Text>
            </Text>
            <Box textAlign="center" w={stepStatColWidth}>
              <UsersCountCell users={stepChoice.usersSelected} />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

const BRANCHING_INFO_QUERY = graphql`
  query BranchingInfoQuery($guideStepBaseEntityId: EntityId!) {
    guideStepBaseInfo: findGuideBaseStepBranches(
      guideStepBaseEntityId: $guideStepBaseEntityId
    ) {
      choiceLabel
      usersSelected {
        fullName
        email
      }
    }
  }
`;

export default function BranchingInfoQueryRenderer({
  isOpen,
  guideStepBaseEntityId,
}: ContainerProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && guideStepBaseEntityId && (
        <QueryRenderer<BranchingInfoQuery>
          query={BRANCHING_INFO_QUERY}
          variables={{
            guideStepBaseEntityId,
          }}
          render={({ props }) => {
            return props ? (
              <motion.div
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: 'auto' },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="flex"
                style={{
                  transformOrigin: 'top center',
                  flex: '1',
                }}
              >
                <BranchingInfo {...props} />
              </motion.div>
            ) : (
              <TableLoadingSpinner />
            );
          }}
        />
      )}
    </AnimatePresence>
  );
}
