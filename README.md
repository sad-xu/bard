# Bard

## FF14 演奏 <s>（吟游诗人）</s> 模拟器

```bash
tcb hosting:deploy -e ff14-3gaz7i4cedb8328b
```

## 功能

键盘 13键

键盘配置菜单 按键映射 浏览器按键限制及提示

音色选择 Timbre 内置多个乐器选项 滤波器参数手动调节 环境音、波形等

canvas 波形图  当前播放曲目 + 键盘演奏响应
（如果感觉到卡顿，请更换浏览器或换台电脑或者用妙哈种子家的电脑(推荐，我家的床还蛮大的)，或者关闭该功能(不推荐)）

MIDI 相关 解析mid文件生成谱子并播放

歌曲列表随机、顺序、重播功能 歌曲暂停、倍速、上下一首功能 

进度条显示、拖拽功能

设备尺寸自适应 -- 媒体查询 √  vw单位 ×

PWA

虚拟平滑惯性滚动

## 需求变更记录

39键键盘及切换功能 -- 取消

节拍器 metronome 节拍器菜单 -- 优先级低

整体风格 -- 不再模仿 FF14 UI

## 公共组件

ff-dialog 模态框

ff-radio 单选框

ff-select 选择器

ff-silder 滑块

ff-button 按钮

## TODO

卷积 添加环境音效 
https://github.com/GoogleChromeLabs/web-audio-samples/tree/gh-pages/samples/audio/impulse-responses

混音器 createDynamicsCompressor
多个音源合并防止爆音

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

## PWA

