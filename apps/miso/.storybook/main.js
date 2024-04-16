module.exports = {
  stories: [{ directory: '../components', titlePrefix: 'Miso' }],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@chakra-ui/storybook-addon',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  features: {
    storyStoreV7: true,
    buildStoriesJson: true,
    emotionAlias: false,
  },
  docs: {
    autodocs: false,
  },
  typescript: {
    reactDocgen: false,
  },
  refs: {
    '@chakra-ui/react': {
      disable: true,
    },
    shoyu: {
      title: 'Shoyu',
      url: 'http://localhost:6007/',
    },
  },
};
