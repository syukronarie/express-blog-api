module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: [
    "airbnb-base",
    "plugin:jest/recommended",
    "plugin:security/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  plugins: ["jest", "security", "prettier"],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "class-methods-use-this": "off",
    "security/detect-object-injection": "off",
    "prettier/prettier": [
      "warn",
      {
        endOfLine: "auto",
        singleQuote: false,
      },
    ],
  },
};
