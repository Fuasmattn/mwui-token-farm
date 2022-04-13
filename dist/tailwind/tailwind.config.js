const { filterTokensByType } = require('../../scripts/utils');
const tokens = require('../light.json');

const colors = filterTokensByType('color', tokens);

module.exports = {
  content: ['*.{html,js,jsx,ts,tsx,vue}'],
  theme: {
    colors,
  },
  variants: {},
  plugins: [],
};
