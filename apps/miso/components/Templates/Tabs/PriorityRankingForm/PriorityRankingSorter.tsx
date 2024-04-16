import React, { FC, useCallback } from 'react';
import { Flex, Text, Tag } from '@chakra-ui/react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useFormikContext } from 'formik';
import DragIndicator from '@mui/icons-material/DragIndicator';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { STANDARD_SHADOW } from 'bento-common/frontend/styles';
import { RankableType } from 'bento-common/types';

import Box from 'system/Box';
import InformationTags from 'components/Library/InformationTags';
import {
  AUTO_LAUNCHABLE_TARGETS_FORM_KEY,
  GenericPriorityFormValues,
} from './helpers';
import DragAndDropProvider from 'providers/DragAndDropProvider';
import TemplateDetailsPopover from 'components/common/TemplateDetailsPopover';
import NpsDetailsPopover from 'components/common/NpsDetailsPopover';

const arrayKey = AUTO_LAUNCHABLE_TARGETS_FORM_KEY;

interface Props {
  isDisabled?: boolean;
  usePopover?: boolean;
  useOpenInNew?: boolean;
}

const PriorityRankingSorter: FC<Props> = ({
  isDisabled,
  usePopover,
  useOpenInNew,
}) => {
  const { values } = useFormikContext<GenericPriorityFormValues>();
  const { autoLaunchableTargets, currentTarget, formEntityLabel } =
    values || {};

  const handleOpenInNew = useCallback(
    (url: string) => () => window.open(url, '_blank'),
    []
  );

  return (
    <DragAndDropProvider formItemsKey={arrayKey} dragShadow={STANDARD_SHADOW}>
      {/** @ts-ignore */}
      <Droppable droppableId={arrayKey}>
        {(provided) => (
          <Box ref={provided.innerRef} {...provided.droppableProps}>
            {autoLaunchableTargets.map(
              (
                { entityId, Icon, name, infoTags, infoTagsFallbackText, type },
                idx
              ) => {
                const isCurrent = entityId === currentTarget?.entityId;
                const rowId = `${arrayKey}[${idx}]`;

                return (
                  // @ts-ignore
                  <Draggable
                    key={rowId}
                    draggableId={rowId}
                    index={idx}
                    isDragDisabled={isDisabled}
                  >
                    {(provided) => {
                      const DisplayText = (
                        <Box fontWeight="semibold" marginTop="2px">
                          {name}{' '}
                          {isCurrent && (
                            <Text
                              fontWeight="normal"
                              fontStyle="italic"
                              display="inline"
                            >
                              (this {formEntityLabel})
                            </Text>
                          )}
                        </Box>
                      );

                      const isTemplate = type === RankableType.guide;

                      return (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          p={3}
                          background="white"
                        >
                          <Box
                            display="flex"
                            w="full"
                            position="relative"
                            alignItems="center"
                          >
                            {isDisabled ? (
                              <Tag w="2" bgColor="gray.50" borderRadius="full">
                                {idx + 1}
                              </Tag>
                            ) : (
                              <Box
                                color="gray.500"
                                display="flex"
                                alignItems="center"
                              >
                                <DragIndicator />
                              </Box>
                            )}
                            <Box ml="2" display="flex" alignItems="center">
                              {Icon && (
                                <Icon
                                  fontSize="small"
                                  transform="scale(0.9)"
                                  role="presentation"
                                />
                              )}
                            </Box>
                            <Flex flexDir="column" gap="2" ml="2">
                              {usePopover ? (
                                isTemplate ? (
                                  <TemplateDetailsPopover
                                    templateEntityId={entityId}
                                  >
                                    {DisplayText}
                                  </TemplateDetailsPopover>
                                ) : (
                                  <NpsDetailsPopover npsEntityId={entityId}>
                                    {DisplayText}
                                  </NpsDetailsPopover>
                                )
                              ) : (
                                DisplayText
                              )}
                              {infoTags?.length > 0 && (
                                <Box>
                                  <InformationTags
                                    elements={infoTags.map((info) => ({
                                      info,
                                    }))}
                                    labelKeys={['info']}
                                    fallbackText={infoTagsFallbackText}
                                  />
                                </Box>
                              )}
                            </Flex>
                            {useOpenInNew && (
                              <Box
                                alignSelf="center"
                                position="absolute"
                                right="0"
                                cursor="pointer"
                                onClick={handleOpenInNew(
                                  `/library/${
                                    isTemplate ? 'templates' : 'nps'
                                  }/${entityId}`
                                )}
                              >
                                <OpenInNewIcon fontSize="small" />
                              </Box>
                            )}
                          </Box>
                        </Box>
                      );
                    }}
                  </Draggable>
                );
              }
            )}
            {provided.placeholder as React.ReactNode}
          </Box>
        )}
      </Droppable>
    </DragAndDropProvider>
  );
};

export default PriorityRankingSorter;
