module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2016: true,
  },
  extends: "prettier",
  overrides: [],
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    requireConfigFile: false,
    babelOptions: {
      parserOpts: {
        plugins: ["jsx"]
      }
    }
  },
  rules: {
    "require-jsdoc": "off",
  },
};
