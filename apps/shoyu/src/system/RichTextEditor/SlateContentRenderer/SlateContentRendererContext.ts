import React from 'react';

const BENTO_PRIMARY_COLOR_DEFAULT = '#73A4FC';
const BENTO_SECONDARY_COLOR_DEFAULT = '#EFF5FF';

const SlateContentRendererContext = React.createContext({
  colors: {
    primary: BENTO_PRIMARY_COLOR_DEFAULT,
    secondary: BENTO_SECONDARY_COLOR_DEFAULT,
  },
});

export default SlateContentRendererContext;
