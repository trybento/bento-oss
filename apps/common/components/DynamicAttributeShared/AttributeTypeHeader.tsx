import { Box } from '@chakra-ui/react';
import { AttributeType } from 'bento-common/types';
import React from 'react';
import colors from '../../frontend/colors';
import { DynamicAttributeSuggestion } from '../RichTextEditor/extensions/DynamicAttribute/Suggestions';

interface Props {
  attribute: DynamicAttributeSuggestion | null | undefined;
}
const AttributeTypeHeader: React.FC<Props> = ({ attribute }) => {
  const type =
    (attribute.type === AttributeType.accountUser ? 'user' : attribute.type) ||
    '';
  const header = `${type.charAt(0).toUpperCase()}${type.slice(1)} attributes`;

  if (!type) return <></>;

  return (
    <Box my="4px" fontWeight="semibold" color={colors.gray[500]}>
      {header}
    </Box>
  );
};

export default AttributeTypeHeader;
