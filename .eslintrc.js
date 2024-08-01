module.exports = {
  parser: "@typescript-eslint/parser", // 使用 TypeScript 解析器
  extends: [
    "airbnb",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended", // 使用 TypeScript 插件推荐规则
    "eslint:recommended",
    "next",
    "plugin:prettier/recommended", // 确保 prettier 插件放在最后
  ],
  plugins: [
    "@typescript-eslint", // 使用 TypeScript 插件
    "prettier", // 使用 Prettier 插件
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true, // 启用 JSX
    },
  },
  rules: {
    // 自定义规则，例如：允许 .js 和 .jsx 文件中的 JSX
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "prettier/prettier": "error", // 使用 Prettier 进行代码格式化检查
    // 允许箭头函数声明函数组件
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    // 其他自定义规则
  },
  settings: {
    react: {
      version: "detect", // 自动检测 React 版本
    },
  },
};
