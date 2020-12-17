module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    es6: true
  },
  extends: [
    '@vue/standard',
    'plugin:vue/recommended',
  ],
  rules: {
    // 多属性换行规则
    "vue/max-attributes-per-line": [2, {
      "singleline": 4,
      "multiline": {
        "max": 3,
        "allowFirstLine": false
      }
    }],
    // 标签结束不换行
    "vue/html-closing-bracket-newline": [2, {
      "singleline": "never",
      "multiline": "never"
    }],
    // html元素禁止自闭
    "vue/html-self-closing": ["error", {
      "html": {
        "normal": "never",
        "component": "never"
      }
    }],
    // 允许 v-html
    "vue/no-v-html": 0,
    // 回调 防止误报
    "standard/no-callback-literal": 0,
    // 函数左括号不加空格
    "space-before-function-paren": ["error", "never"],
    // 不检查 回调容错
    "handle-callback-err": 0,
    // 关闭console警告
    "no-console": 0
  }
}
