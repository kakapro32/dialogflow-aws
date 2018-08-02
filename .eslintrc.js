module.exports = {
  extends: "airbnb-base",
  rules: {
    'no-console': 'off',
    "quotes": [
      2,
      "single"
    ],
    "linebreak-style": [
      2,
      "unix"
    ],
    "semi": [
      2,
      "always"
    ],
    "no-use-before-define": ["error", { "functions": false, "classes": false }]
  },
};
