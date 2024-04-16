const LineClampPlugin = require('@tailwindcss/line-clamp');

module.exports = {
  corePlugins: {
    // due to https://github.com/tailwindlabs/tailwindcss/issues/6602 - buttons disappear
    preflight: false,
  },
  content: [
    './src/components/**/*.{js,ts,jsx,tsx}',
    '../common/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      textColor: {
        'code-block': '#cdff6f',
      },
      backgroundColor: (theme) => ({
        'code-block': '#24324b',
      }),
    },
  },
  plugins: [LineClampPlugin],
};
