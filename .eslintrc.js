module.exports = {
  extends: "airbnb-base",
  env: {
    "node": true,
    "commonjs": true,
    "es6": true,
    "jest": true,
    "jasmine": true
  },
  extends: [
    "eslint:recommended"
  ],
  parserOptions: {
    "ecmaVersion": 2017,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }
  },
  rules: {
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "no-console": 0,
    "no-param-reassign": 0,
    "consistent-return": 0,
    "prefer-destructuring": ["warn", {
      "array": false,
      "object": false
    }, { "enforceForRenamedProperties": false }],
    "comma-dangle": ["warn", "never"],
    "indent": [
      "warn",
      2,
      {
        "SwitchCase": 1
      }
    ],
    "quotes": [
      "warn",
      "single"
    ],
    "semi": [
      "warn",
      "always"
    ],
    "no-var": [
      "warn"
    ],
    "no-console": [
      "off"
    ],
    "no-unused-vars": [
      "warn"
    ],
    "no-mixed-spaces-and-tabs": [
      "warn"
    ]
  }
};
