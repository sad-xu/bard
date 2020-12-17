module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    // 关闭空行规则
    'rule-empty-line-before': null,
    // 允许使用 @for 等操作
    'at-rule-no-unknown': null
  }
}
