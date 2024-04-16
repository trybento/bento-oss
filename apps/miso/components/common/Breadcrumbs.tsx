import React from 'react';
import Text from 'system/Text';
import Box from 'system/Box';
import Link from 'system/Link';

export interface Breadcrumb {
  label: string;
  path?: string;
}

interface Props {
  trail: Breadcrumb[];
}

const Breadcrumbs: React.FC<Props> = ({ trail }) => {
  return (
    <Box
      w="full"
      fontSize="sm"
      color="gray.600"
      display="inline-block"
      zIndex="5"
    >
      {trail.map(({ path, label }, i) => {
        const lastEle = i === trail.length - 1;
        const displayLabel = `${label}${lastEle ? '' : ' > '}`;

        if (!path) {
          return (
            <Text key={label} display="inline">
              {displayLabel}
            </Text>
          );
        }

        return (
          <Link href={path} key={label} _hover={{ textDecoration: 'none' }}>
            {displayLabel}
          </Link>
        );
      })}
    </Box>
  );
};
export default Breadcrumbs;
