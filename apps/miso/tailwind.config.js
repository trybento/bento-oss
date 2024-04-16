const LineClampPlugin = require('@tailwindcss/line-clamp');

module.exports = {
  corePlugins: {
    // due to https://github.com/tailwindlabs/tailwindcss/issues/6602 - buttons disappear
    preflight: false,
  },
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './icons/**/*.{js,ts,jsx,tsx}',
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
