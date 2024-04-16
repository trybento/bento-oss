import React from 'react';

const BENTO_PRIMARY_COLOR_DEFAULT = '#73A4FC';
const BENTO_SECONDARY_COLOR_DEFAULT = '#EFF5FF';

const OrganizationUIContext = React.createContext({
  primaryColorHex: BENTO_PRIMARY_COLOR_DEFAULT,
  secondaryColorHex: BENTO_SECONDARY_COLOR_DEFAULT,
});

/**
 * @deprecated should be removed in favor of new ui store
 */
export default OrganizationUIContext;
