const csso = require('postcss-csso');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [tailwindcss(), autoprefixer(), csso()],
};
