module.exports = ({ options }) => ({
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      stage: 0,
      features: {
        'custom-media-queries': {
          importFrom: {
            customMedia: {
              /* BREAKPOINTS SHOULD NOT BE CHANGED WITHOUT ANALYSIS */
              '--b_xs': `screen and (max-width: 575px)`,
              '--b_sm': `screen and (min-width: 576px)`,
              '--b_md': `screen and (min-width: 768px)`,
              '--b_lg': `screen and (min-width: 1024px)`,
              '--b_xl': `screen and (min-width: 1176px)`,
              '--b_sm_max': `screen and (max-width: 767px)`,
              '--b_md_max': `screen and (max-width: 1023px)`,
              '--b_lg_max': `screen and (max-width: 1175px)`,
            },
          },
        },
      },
    },
    'postcss-prefixwrap': options.modules ? `:global(${options.wrap})` : options.wrap,
  },
});
