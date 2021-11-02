# vue-hzj-keyboard

> 基于vue的一款JS虚拟键盘,带拼音输入法，和QQ的手写输入法
---

## 安装
### npm安装
```
npm install vue-hzj-keyboard -S
```
在 main.js 中写入以下内容全局注册：
```
import VueHzjKeyboard from 'vue-hzj-keyboard'
Vue.use(VueHzjKeyboard)
```

### 标签引入
```
handwritingapi.js要在全局引入，此文件在组件目录下面的lib目录里
<script src="./handwritingapi.js"></script>
```

---
## 使用
在非`all`模式下，input标签添加属性`data-mode`，然后在合适位置放置组件`<vue-hzj-keyboard></vue-hzj-keyboard>`即可。
```
<input type="text" data-mode="en_cap" />
<vue-hzj-keyboard float></vue-hzj-keyboard>
```

组件添加`all`属性即可为所有input标签注册弹出输入法
```
<vue-hzj-keyboard all float :blurHide="true" hand></vue-hzj-keyboard>
```
---
## input标签属性
|属性|说明|类型|可选值|默认值|
|:-:|:-|:-|:-|:-|
|**data-mode**|弹出输入法的类型：<br>`en_let` 英文小写<br>`en_cap` 英文大写<br>`cn` 中文<br>`hand` 手写|String|`en_let`<br>`en_cap`<br>`cn`<br>`hand`|`en_let`|
## 组件属性
|属性|说明|类型|可选值|默认值|
|:-:|:-|:-|:-|:-|
|**all**|是否为所有`input`标签注册弹出输入法|Boolean|true/false|false|
|**float**|是否使输入法组件浮动在当前`input`标签下方|Boolean|true/false|false|
|**hand**|是否启用手写输入，默认禁用|Boolean|true/false|false|
|**blurHide**|当`input`标签失去焦点时是否隐藏输入组件|Boolean|true/false|true|
|**enter-active-class**|输入组件弹出来的动画效果，基于[Animate.css](https://daneden.github.io/animate.css/)|String|见 [Animate.css](https://daneden.github.io/animate.css/) 官网|fadeInUp|
|**leave-active-class**|输入组件隐藏时的动画效果|String|同上|fadeOutDown|

>手写输入法是QQ输入法手写识别汉字web版