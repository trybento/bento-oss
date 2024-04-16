import 'tailwindcss/tailwind.css';
import 'bento-common/css/animation.css';

import { themeOptions } from '../src/storybook/CustomUIProvider/themes';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color|hex)$/i,
      date: /Date$/,
    },
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    descrpition: 'Organization Styles',
    defaultValue: 'default',
    toolbar: {
      icon: 'contrast',
      showName: true,
      dynamicTitle: true,
      items: themeOptions,
    },
  },
};
