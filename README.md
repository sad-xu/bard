# Bard

## FF14 光之演奏家 演奏 <s>（吟游诗人）</s> 模拟器

## 安装

`npm config set registry https://registry.npm.taobao.org -g`

`npm i`

## VSCode 相关

必装插件 `Vetur`、`ESLint`、`stylelint`、`EditorConfig for VS Code`

```json
// 保存时自动修复
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true,
  "source.fixAll.stylelint": true
}
```

## 打包发布

```bash
cd dist
# 全部上传
tcb hosting deploy -e ff14-3gaz7i4cedb8328b
# 上传部分
tcb hosting deploy ./static/ static/ -e ff14-3gaz7i4cedb8328b
tcb hosting deploy ./index.html ./index.html -e ff14-3gaz7i4cedb8328b
# 删除
tcb hosting delete -e ff14-3gaz7i4cedb8328b
# tcb hosting delete -d cloudPath -e ff14-3gaz7i4cedb8328b
# 查看文件
tcb hosting list -e ff14-3gaz7i4cedb8328b
```

## 功能

键盘 13键

键盘配置菜单 按键映射 浏览器按键限制及提示

音色选择 Timbre 内置多个乐器选项 滤波器参数手动调节 环境音、波形等

canvas 波形图  当前播放曲目 + 键盘演奏响应

MIDI 相关 解析mid文件生成谱子并播放

歌曲列表随机、顺序、重播功能 歌曲暂停、倍速、上下一首功能 

进度条显示、拖拽功能

设备尺寸自适应 -- 媒体查询 √  vw单位 ×

PWA

## 需求变更记录

节拍器 metronome 节拍器菜单 -- 优先级低

整体风格 -- 不再模仿 FF14 UI

音色 -- 不再使用振荡器发声,声音单调刺耳 改用录制好的乐器音频数据

## 公共组件

ff-dialog 模态框

ff-radio 单选框

ff-select 选择器

ff-silder 滑块

ff-button 按钮

## 参考

https://googlechromelabs.github.io/web-audio-samples/

https://googlechromelabs.github.io/web-audio-samples/archive/demos/samples.html

https://xsound.app/

## MIDI

https://www.jianshu.com/p/31d02765e1ec

https://github.com/grimmdude/MidiPlayerJS/blob/9c3bc8ddd1f0eed026d6be6e9d4f73bcdd0d637f/src/player.js

http://read.pudn.com/downloads64/doc/fileformat/227082/midi_information_and_standard_midi_file_format_anatomy.pdf

https://www.jianshu.com/p/6c495b51a40c

歌曲资源网站 - `https://www.midishow.com/search/result?q=ff14&sort=marks`

## 快捷键禁用

* Chrome Edge  Opera

  方案一：

  https://web.dev/keyboard-lock/

  https://garykac.github.io/system-keyboard-lock/

  先通过代码进入全屏模式（F11无效）
  调用 lock

  ```js
  await document.documentElement.requestFullscreen()
  await navigator.keyboard.lock()
  ```

  `chrome://flags/#system-keyboard-lock = Default / Enabled` 

  方案二：

  安装能设置快捷键的浏览器插件

* Firefox

  安装能设置快捷键的浏览器插件，如 `shortkeys`

  `about:config permissions.default.shortcuts = 2`

## PWA - Workbox

`index.html` 不缓存，其他缓存

## 音色

* 滤波器 改变不大

* 自定义音源波形 createPeriodicWave

```js
// https://googlechromelabs.github.io/web-audio-samples/archive/demos/wavetable-synth.html
// https://github.com/GoogleChromeLabs/web-audio-samples/tree/gh-pages/samples/audio/wave-tables
```

自定义波形参数

https://github.com/lukehorvat/web-audio-oscillators/tree/master/lib

https://github.com/mohayonao/wave-tables

* 已改为使用音频数据

## 个人配置

```json
{"higher":"shiftKey","lower":"ctrlKey","highSemitone":{"label":"Tab","key":"Tab"},"lowSemitone":{"label":"AltLeft","key":"AltLeft"},"common":{"KeyQ":"1-h","KeyW":"2-h","KeyE":"3-h","KeyR":"4-h","KeyT":"5-h","KeyY":"6-h","KeyU":"7-h","KeyI":"i-h","KeyA":"1","KeyS":"2","KeyD":"3","KeyF":"4","KeyG":"5","KeyH":"6","KeyJ":"7","KeyZ":"1-l","KeyX":"2-l","KeyC":"3-l","KeyV":"4-l","KeyB":"5-l","KeyN":"6-l","KeyM":"7-l","KeyO":"1#-h","KeyP":"3b-h","BracketLeft":"4#-h","BracketRight":"5#-h","Backslash":"7b-h","Digit6":"1#","Digit7":"3b","Digit8":"4#","Digit9":"5#","Digit0":"7b","Digit1":"1#-l","Digit2":"3b-l","Digit3":"4#-l","Digit4":"5#-l","Digit5":"7b-l"}}

{"higher":"shiftKey","lower":"ctrlKey","highSemitone":{"label":"","key":""},"lowSemitone":{"label":"","key":""},"common":{"Digit1":"1","Digit2":"2","Digit3":"3","Digit4":"4","Digit5":"5","Digit6":"6","Digit7":"7","Digit8":"i","KeyZ":"1#","KeyX":"3b","KeyC":"4#","KeyV":"5#","KeyB":"7b"}}
```

## 拓展

网页版midi编辑器

* 技术栈
  
  Vue3 + TS or React + TS

  第三方库 - 能不用就不用

* 后端 ? 云函数 ?

  用户系统 ? ×

  保存乐谱 分享 搜索 评分

* 音阶
  
  4 5 6 or 全部

* 编辑区
  
  时间轴 | 音符

  速度 节拍

* 文件操作
  
  导入导出mid
  
  midi文件内容拼接
