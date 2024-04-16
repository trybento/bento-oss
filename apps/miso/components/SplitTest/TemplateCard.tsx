import { FC, ReactNode, useMemo } from 'react';
import { Box, BoxProps, Flex, Link } from '@chakra-ui/react';
import { GuideFormFactor, Theme } from 'bento-common/types';
import { areStepDetailsHidden } from 'bento-common/utils/formFactor';
import { pluralize } from 'bento-common/utils/pluralize';
import { guidePrivateOrPublicNameOrFallback } from 'bento-common/utils/naming';

import Badge, { BadgeStyle } from 'system/Badge';
import colors from 'helpers/colors';
import { LayoutBadge } from '../Library/TemplateStatus';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';

type Props = {
  nameOverride?: ReactNode;
  descriptionOverride?: ReactNode;
  template: {
    entityId: string;
    name: string;
    privateName?: string;
    isCyoa: boolean;
    description: string;
    stepsCount: number;
    theme: Theme;
    formFactor: GuideFormFactor;
  };
} & BoxProps;

const TemplateCard: FC<Props> = ({
  children,
  template,
  nameOverride,
  descriptionOverride,
  ...boxProps
}) => {
  const { entityId, description, stepsCount, theme, formFactor, isCyoa } =
    template || {};
  const enabledInternalNames = useInternalGuideNames();

  const stepsInfo: {
    calloutType: BadgeStyle;
    text: string;
  } | null = useMemo(() => {
    if (areStepDetailsHidden(formFactor as GuideFormFactor, theme as Theme))
      return null;

    return {
      calloutType:
        stepsCount <= 5
          ? BadgeStyle.active
          : stepsCount <= 7
          ? BadgeStyle.warning
          : BadgeStyle.error,
      text: `${stepsCount} ${pluralize(stepsCount, 'step')}`,
    };
  }, [stepsCount, theme, formFactor]);

  return (
    <Flex p="4" border="1px solid #E3E8F0" borderRadius="lg" {...boxProps}>
      <Flex flexDir="column" gap="3" flex="1" overflow="hidden">
        <Flex
          fontSize="lg"
          color={colors.text.secondary}
          fontWeight="bold"
          gap="6"
          my="auto"
        >
          {nameOverride !== undefined ? (
            nameOverride
          ) : entityId ? (
            <Link
              href={`/library/templates/${entityId}`}
              target="_blank"
              textDecoration="underline"
              noOfLines={1}
            >
              {guidePrivateOrPublicNameOrFallback(
                enabledInternalNames,
                template
              )}
            </Link>
          ) : (
            'No guide'
          )}
          {entityId && (
            <>
              <LayoutBadge
                theme={theme}
                isCyoa={isCyoa}
                formFactor={formFactor}
                pointerEvents="none"
              />
              {stepsInfo && (
                <Badge
                  label={stepsInfo.text}
                  variant={stepsInfo.calloutType}
                  my="auto"
                  fontWeight="normal"
                  whiteSpace="nowrap"
                  pointerEvents="none"
                />
              )}
            </>
          )}
        </Flex>
        {descriptionOverride !== undefined
          ? descriptionOverride
          : description && (
              <Box title={description} noOfLines={1}>
                {description}
              </Box>
            )}
        {children}
      </Flex>
    </Flex>
  );
};

export default TemplateCard;
