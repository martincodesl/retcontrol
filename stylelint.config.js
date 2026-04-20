module.exports = {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['src/app/globals.css'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'layer',
          'base',
          'components',
          'utilities'
        ]
      }
    ]
  }
};
