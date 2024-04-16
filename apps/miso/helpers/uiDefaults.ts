import { ResponsiveValue, TabProps } from '@chakra-ui/react';
import React from 'react';
import colors from './colors';

export const DEFAULT_COLORS = {
  disabled: colors.gray[600],
  primaryText: colors.gray[800],
  secondaryText: colors.gray[600],
  secondaryIcon: colors.gray[500],
  background: 'white',
};

/** Should be controlled in extendTheme probably */
export const TAB_STYLE: TabProps = {
  borderBottomWidth: '4px',
  py: '3',
  textAlign: 'center' as ResponsiveValue<any>,
  color: 'blue.800',
  minWidth: '132px',
  _focus: {
    outline: 0,
  },
  _active: {
    outline: 0,
  },
  _selected: {
    fontWeight: '600',
    borderBottomColor: 'b-primary.500',
  },
};

export const RADIO_STYLE = {
  size: 'md',
  mr: '6',
  border: '1px solid',
  borderColor: `gray.300`,
  _checked: {
    backgroundColor: colors.bento.logo,
    outline: `1px solid ${colors.gray[300]}`,
    border: '4px solid white',
  },
};

export const TABLIST_STYLE: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  backgroundColor: 'white',
  zIndex: 11,
  boxShadow: '0 2px 4px -2px rgb(0 0 0 / 6%)',
};
