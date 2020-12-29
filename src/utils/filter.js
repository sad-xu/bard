const regExp = /Digit|Key/

// 按键绑定显示 物理按键 -> 显示按键
export function toggleKeycode(code) {
  if (regExp.test(code)) {
    return code.slice(-1)
  } else return code
}
