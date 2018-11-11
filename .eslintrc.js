module.exports = {
  extends: 'airbnb-base',
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
  },
};
