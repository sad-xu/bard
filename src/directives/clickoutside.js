/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-clickoutside="handleClose">
 * ```
 */

const nodeList = []
const ctx = '@@clickoutsideContext'

let startClick
let seed = 0

window.addEventListener('mousedown', e => {
  startClick = e
})

window.addEventListener('mouseup', e => {
  nodeList.forEach(node => {
    node[ctx].documentHandler(e, startClick)
  })
})

function createDocumentHandler(el, binding, vnode) {
  return function(mouseup, mousedown) {
    if (
      !vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      ( // 自身不触发
        vnode.context.isPopperElm &&
        (
          vnode.context.$el.contains(mouseup.target) ||
          vnode.context.$el.contains(mousedown.target)
        )
      )
    ) return
    if (binding.expression && el[ctx].methodName && vnode.context[el[ctx].methodName]) {
      vnode.context[el[ctx].methodName]()
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn()
    }
  }
}

export default {
  bind(el, binding, vnode) {
    nodeList.push(el)
    const id = seed++
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value
    }
  },
  unbind(el) {
    const len = nodeList.length
    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1)
        break
      }
    }
    delete el[ctx]
  }
}
