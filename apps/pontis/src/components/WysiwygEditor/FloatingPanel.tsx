import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
} from '@chakra-ui/react';
import ProgressMeter from 'bento-common/components/ProgressMeter';
import { GuideHeaderProgressBar, WysiwygEditorMode } from 'bento-common/types';
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react';

import colors from '~src/ui/colors';

import HorizontalArrowIcon from '../system/HorizontalArrowIcon';
import AccordionIcon from './AccordionIcon';
import { WYSIWYG_FLOATING_SHADOW } from './constants';
import { FloatingPanelProgress, FloatingPanelSide } from './types';

interface Props {
  children: ReactNode;
  currentMode: WysiwygEditorMode;
  floatingPanelProgress?: FloatingPanelProgress;
}

const titlesByMode: Partial<Record<WysiwygEditorMode, string>> = {
  [WysiwygEditorMode.customize]: 'Customize style',
  [WysiwygEditorMode.confirmElement]: 'Select anchor element',
  [WysiwygEditorMode.customizeContent]: 'Add content',
};

const FloatingPanel: FC<Props> = ({
  children,
  floatingPanelProgress = {},
  currentMode,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [floatingPanelSide, setFloatingPanelSide] = useState<FloatingPanelSide>(
    FloatingPanelSide.right,
  );

  const toggleFloatingPanelSide = useCallback(() => {
    setFloatingPanelSide((side) =>
      side === FloatingPanelSide.right
        ? FloatingPanelSide.left
        : FloatingPanelSide.right,
    );
  }, []);

  const toggleAccordion = useCallback(() => {
    setIsOpen((open) => !open);
  }, []);

  const totalSteps = useMemo(
    () =>
      Object.values(floatingPanelProgress).reduce((acc, v) => {
        return v > acc ? v : acc;
      }, 0),
    [floatingPanelProgress],
  );

  const title = titlesByMode[currentMode] || '';
  const isFloatingPanelLeftPositioned =
    floatingPanelSide === FloatingPanelSide.left;

  return (
    <Accordion
      {...{
        [isFloatingPanelLeftPositioned ? 'left' : 'right']: '40px',
      }}
      position="absolute"
      bottom="90px"
      borderRadius="md"
      background="white"
      boxShadow={WYSIWYG_FLOATING_SHADOW}
      w="500px"
      allowToggle
      index={isOpen ? 0 : -1}
      onChange={toggleAccordion}
      reduceMotion>
      <AccordionItem border="none" p="6">
        <Flex gap="2" flexDir="column">
          <Flex gap="2">
            <Box flex="1" fontWeight="bold" fontSize="md">
              {title}
            </Box>
            <Button
              variant="secondary"
              fontSize="xs"
              p="1.5"
              h="8"
              onClick={toggleFloatingPanelSide}>
              <HorizontalArrowIcon
                variant="mui"
                isLeft={!isFloatingPanelLeftPositioned}
              />
              Move {isFloatingPanelLeftPositioned ? 'right' : 'left'}
            </Button>
            <AccordionButton
              as={Button}
              variant="secondary"
              w="auto"
              fontSize="xs"
              p="1.5"
              h="8">
              <AccordionIcon variant="mui" inverted />
              <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                {isOpen ? 'Hide' : 'Show'}
              </Box>
            </AccordionButton>
          </Flex>
          {totalSteps > 0 && (
            <ProgressMeter
              primaryColorHex={colors.bento.bright}
              completedSteps={floatingPanelProgress[currentMode]}
              totalSteps={totalSteps}
              type={GuideHeaderProgressBar.sections}
              className="h-1"
              incompleteColorHex="#E2E8F0"
              focusLastComplete
            />
          )}
        </Flex>

        <AccordionPanel
          pt="6"
          pb="0"
          fontSize="xs"
          px="px"
          bg="white"
          borderRadius="md">
          {children}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default FloatingPanel;
