<template>
  <transition
    :enter-active-class="'animated faster '+EnterActiveClass"
    :leave-active-class="'animated faster '+LeaveActiveClass"
  >
    <div v-show="show" :style="st" class="my-keyboard" @mousedown="mousedown" ref="my_keyboard">
      <div v-if="mode==='cn'" class="pinyin">
        <div>
          <span>{{cn_input}}</span>
        </div>
      </div>
      <div v-if="mode==='cn'" class="select-list">
        <div>
          <span
            class="select-text"
            v-for="(text, index) in cut_cn_list"
            :key="index"
            @click="e=>clickCN(e, text)"
          >{{(index+1)+'.'+text}}</span>
          <div class="page">
            <p class="previous" @click="previous_page()">v</p>
            <p class="next" @click="next_page()">v</p>
          </div>
        </div>
      </div>
      <!-- 数字键盘 -->
      <div v-if="mode==='num'||mode==='biaodian'" class="main-keyboard">
        <div class="number-box">
          <span
            class="key number"
            :key="index"
            v-for="(key, index) in number_keys2"
            @click="e=>clickNumber(e, key)"
          >{{key}}</span>
        </div>
        <div class="del-box">
          <span class="key number num-del" @click="del()">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="75" height="75" style="margin-top:-5;">
              <path
                d="M938.8 227.7H284.6L0.1 511.3l284.4 284.4v0.8h654.2c47.1 0 85.3-38.2 85.3-85.3V313c0.1-47.1-38.1-85.3-85.2-85.3z m-172.1 385l-40.2 40.2-100.6-100.6-100.6 100.6-40.2-40.2 100.6-100.6-100.6-100.5 40.2-40.2L625.9 472l100.6-100.6 40.2 40.2-100.6 100.5 100.6 100.6z"
              />
            </svg>
          </span>
          <!-- <span v-if="mode==='biaodian'" class="key number blue"></span>
          <span v-else class="key number" @click="mode='biaodian'">标点</span>-->
          <span class="key number blue" @click="mode='en_cap'" style="font-size: 36px;">中/英</span>
          <span class="key key_hide number" style="margin-left: 0px;" @click="HideKey">
            <svg class="jp" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M390.94044445 560.84859262h97.39377777V463.45481485H390.94044445v97.39377777zM560.24177778 317.81925929H463.75822222v97.39377778h97.39377778V317.81925929z m-145.63555556 0H318.12266667v97.39377778h97.39377778V317.81925929z m291.27111111 0H609.39377778v97.39377778h97.39377777V317.81925929zM536.576 560.84859262h97.39377778V463.45481485H536.576v97.39377777zM268.97066667 317.81925929H172.48711111v97.39377778h97.39377778V317.81925929z m486.05866666 97.39377778h97.39377778V317.81925929H755.02933333v97.39377778z m145.63555556-243.02933334H123.33511111c-53.70311111 0-97.39377778 43.69066667-97.39377778 97.39377778V754.72592595c0 53.70311111 43.69066667 97.39377778 97.39377778 97.39377778h776.41955556c53.70311111 0 97.39377778-43.69066667 97.39377778-97.39377778V269.57748151c0-53.70311111-43.69066667-97.39377778-96.48355556-97.39377778z m48.24177778 582.54222222c0 26.39644445-21.84533333 48.24177778-48.24177778 48.24177778H123.33511111c-26.39644445 0-48.24177778-21.84533333-48.24177778-48.24177778V269.57748151c0-26.39644445 21.84533333-48.24177778 48.24177778-48.24177778h776.41955556c26.39644445 0 48.24177778 21.84533333 48.24177778 48.24177778l0.91022222 485.14844444zM682.21155555 560.84859262h97.39377778V463.45481485H682.21155555v97.39377777z m-388.66488888 145.63555556h436.90666666V609.0903704H293.54666667v97.39377778zM341.78844445 463.45481485H245.30488889v97.39377777h97.39377778V463.45481485z"
              />
            </svg>
            <span>
              隐藏
              <br />
              <i style="display:block;transform: scaleX(2);">v</i>
            </span>
          </span>
          <span class="key number blue" @click="Fanhui()" style="font-size: 36px;">返回</span>
        </div>
      </div>
      <!-- 手写键盘 -->
      <div v-else-if="mode==='hand'&&main_width" class="main-keyboard">
        <!-- <div class="hand-left-box">
          <span class="key" @click="e=>clickKey(e, '，',true)">，</span>
          <span class="key" @click="e=>clickKey(e, ';',true)">;</span>
          <span class="key" @click="e=>clickKey(e, '@',true)">@</span>
          <span class="key" @click="e=>clickKey(e, '。',true)">。</span>
          <span class="key" @click="e=>clickKey(e, '.',true)">.</span>          
        </div> -->
        <paint
          :p_width="main_width"
          :p_height="main_height"
          @SelectText="HandText"
        ></paint>
        <div class="hand-left-box">
          <span class="key hand-del" @click="del()">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
              <path
                d="M938.8 227.7H284.6L0.1 511.3l284.4 284.4v0.8h654.2c47.1 0 85.3-38.2 85.3-85.3V313c0.1-47.1-38.1-85.3-85.2-85.3z m-172.1 385l-40.2 40.2-100.6-100.6-100.6 100.6-40.2-40.2 100.6-100.6-100.6-100.5 40.2-40.2L625.9 472l100.6-100.6 40.2 40.2-100.6 100.5 100.6 100.6z"
              />
            </svg>
          </span>
          <span class="key key_hide" @click="HideKey">
            <svg class="jp" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M390.94044445 560.84859262h97.39377777V463.45481485H390.94044445v97.39377777zM560.24177778 317.81925929H463.75822222v97.39377778h97.39377778V317.81925929z m-145.63555556 0H318.12266667v97.39377778h97.39377778V317.81925929z m291.27111111 0H609.39377778v97.39377778h97.39377777V317.81925929zM536.576 560.84859262h97.39377778V463.45481485H536.576v97.39377777zM268.97066667 317.81925929H172.48711111v97.39377778h97.39377778V317.81925929z m486.05866666 97.39377778h97.39377778V317.81925929H755.02933333v97.39377778z m145.63555556-243.02933334H123.33511111c-53.70311111 0-97.39377778 43.69066667-97.39377778 97.39377778V754.72592595c0 53.70311111 43.69066667 97.39377778 97.39377778 97.39377778h776.41955556c53.70311111 0 97.39377778-43.69066667 97.39377778-97.39377778V269.57748151c0-53.70311111-43.69066667-97.39377778-96.48355556-97.39377778z m48.24177778 582.54222222c0 26.39644445-21.84533333 48.24177778-48.24177778 48.24177778H123.33511111c-26.39644445 0-48.24177778-21.84533333-48.24177778-48.24177778V269.57748151c0-26.39644445 21.84533333-48.24177778 48.24177778-48.24177778h776.41955556c26.39644445 0 48.24177778 21.84533333 48.24177778 48.24177778l0.91022222 485.14844444zM682.21155555 560.84859262h97.39377778V463.45481485H682.21155555v97.39377777z m-388.66488888 145.63555556h436.90666666V609.0903704H293.54666667v97.39377778zM341.78844445 463.45481485H245.30488889v97.39377777h97.39377778V463.45481485z"
              />
            </svg>
            <span>
              隐藏
              <br />
              <i style="display:block;transform: scaleX(2);">v</i>
            </span>
          </span>
          <span class="key blue" @click="mode='biaodian'">标点</span>
          <span class="key blue" @click="mode='num'">数字</span>
		  <span class="key blue" @click="mode='en_cap'">键盘</span>
          
        </div>
      </div>
      <!-- 普通键盘 -->
      <div v-else class="main-keyboard">
        <span
          class="key"
          v-for="(key, index) in number_keys"
          :key="index+50"
          @click="e=>clickNumber(e, key)"
        >{{key}}</span>
        <br />
        <span
          class="key letter"
          v-for="(key, index) in letter_keys.slice(0,10)"
          :key="index+11"
          @click="e=>clickKey(e, key)"
        >{{key}}</span>
        <br />
        <span
          class="key letter"
          v-for="(key, index) in letter_keys.slice(10,19)"
          :key="index+21"
          @click="e=>clickKey(e, key)"
        >{{key}}</span>
        <br />
        <span
          v-if="mode==='cn'||mode==='en_cap'"
          class="key cap_change"
          style="background: #728fa8;"
          @click="cap_change()"
        >{{mode==='cn'?'':'已锁定大写'}}</span>
        <span v-else class="key cap_change" @click="cap_change()">切换大写</span>
        <span
          class="key letter"
          v-for="(key, index) in letter_keys.slice(19,26)"
          :key="index+31"
          @click="e=>clickKey(e, key)"
        >{{key}}</span>
        <span class="key key_hide" style="width: 140px;margin-left: 48px;" @click="HideKey">
          <svg class="jp" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M390.94044445 560.84859262h97.39377777V463.45481485H390.94044445v97.39377777zM560.24177778 317.81925929H463.75822222v97.39377778h97.39377778V317.81925929z m-145.63555556 0H318.12266667v97.39377778h97.39377778V317.81925929z m291.27111111 0H609.39377778v97.39377778h97.39377777V317.81925929zM536.576 560.84859262h97.39377778V463.45481485H536.576v97.39377777zM268.97066667 317.81925929H172.48711111v97.39377778h97.39377778V317.81925929z m486.05866666 97.39377778h97.39377778V317.81925929H755.02933333v97.39377778z m145.63555556-243.02933334H123.33511111c-53.70311111 0-97.39377778 43.69066667-97.39377778 97.39377778V754.72592595c0 53.70311111 43.69066667 97.39377778 97.39377778 97.39377778h776.41955556c53.70311111 0 97.39377778-43.69066667 97.39377778-97.39377778V269.57748151c0-53.70311111-43.69066667-97.39377778-96.48355556-97.39377778z m48.24177778 582.54222222c0 26.39644445-21.84533333 48.24177778-48.24177778 48.24177778H123.33511111c-26.39644445 0-48.24177778-21.84533333-48.24177778-48.24177778V269.57748151c0-26.39644445 21.84533333-48.24177778 48.24177778-48.24177778h776.41955556c26.39644445 0 48.24177778 21.84533333 48.24177778 48.24177778l0.91022222 485.14844444zM682.21155555 560.84859262h97.39377778V463.45481485H682.21155555v97.39377777z m-388.66488888 145.63555556h436.90666666V609.0903704H293.54666667v97.39377778zM341.78844445 463.45481485H245.30488889v97.39377777h97.39377778V463.45481485z"
            />
          </svg>
          <span>
            隐藏
            <br />
            <i style="display:block;transform: scaleX(2);">v</i>
          </span>
        </span>
        <br />
        <span v-if="mode==='cn'" @click="cn_change()" class="key blue">
          中 /
          <i style="font-size:16px;font-weight:500;">英</i>
        </span>
        <span v-else @click="cn_change()" class="key blue">
          英 /
          <i style="font-size:16px;font-weight:500;">中</i>
        </span>
        <span @click="mode='hand'" class="key red">手写</span>
        <span @click="num_change()" class="key blue">数字</span>
        <span @click="bd_change()" class="key blue">标点</span>
        <span class="key" @click="e=>clickKey(e, '@',true)">@</span>
        <span class="key" @click="e=>clickKey(e, '.',true)">.</span>
        <span class="key space" @click="e=>clickKey(e, ' ',true)">空格</span>
        <span class="key def-del" style="width:140px;" @click="del()">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
            <path
              d="M938.8 227.7H284.6L0.1 511.3l284.4 284.4v0.8h654.2c47.1 0 85.3-38.2 85.3-85.3V313c0.1-47.1-38.1-85.3-85.2-85.3z m-172.1 385l-40.2 40.2-100.6-100.6-100.6 100.6-40.2-40.2 100.6-100.6-100.6-100.5 40.2-40.2L625.9 472l100.6-100.6 40.2 40.2-100.6 100.5 100.6 100.6z"
            />
          </svg>
        </span>
      </div>
    </div>
  </transition>
</template>

<script>
import AllKey from "./key";
import dict from "./pinyin_dict_notone";
import paint from "./paint.vue";
import "animate.css";
export default {
  mounted() {
    const _this = this;
    this.$nextTick(() => {
      //每个input添加事件
      let inputAll = document.querySelectorAll("input");
      inputAll.forEach(input => {
        if (_this.all || input.dataset.mode) {
          input.addEventListener("focus", _this.showKeyBoard);
          if (_this.blurHide)
            input.addEventListener("blur", e => {
              if (
                _this.all ||
                (e.relatedTarget && e.relatedTarget.dataset.mode)
              )
                return;
              _this.show = false;
            });
        }
      });
    });
  },
  components: { paint },
  props: {
    hand: { type: Boolean, default: false },
    float: { type: Boolean, default: false },
    all: { type: Boolean, default: false },
    blurHide: { type: Boolean, default: true },
    EnterActiveClass: { type: String, default: "fadeInUp" },
    LeaveActiveClass: { type: String, default: "fadeOutDown" }
  },  
  data() {
    return {
      st: "",
      show: false,
      input_top: 0,
      input: "",
      def_mode: "cn",
      old_mode: "en_cap",
      main_width: 0,
      main_height: 0,
      number_keys: AllKey.number,
      // number_keys2: AllKey.number2,
      // letter_keys: AllKey.cap_letter,
      cn_input: "",
      cn_list_str: "",
      l_min: 0,
      l_max: 12,
      handLib: "CN"
    };
  },
  watch: {
    
  },
  computed: {
    number_keys2() {
      return this.mode === "num" ? AllKey.number2 : AllKey.biaodian;
    },
    letter_keys() {
      return this.mode === "en_cap" ? AllKey.cap_letter : AllKey.letter;
    },
    cn_list() {
      return this.cn_list_str ? this.cn_list_str.split("") : [];
    },
    cut_cn_list() {
      return this.cn_list.slice(this.l_min, this.l_max);
    },
    mode: {
      get() {
        return this.def_mode;
      },
      set(val) {
        this.old_mode = this.mode;
        // console.log(this.hand);
        if (val == "hand" && (!this.hand)) return;
        this.def_mode = val;
        // console.log(this.def_mode);
        if (val == "hand") {
          this.$nextTick(() => {
            this.main_width = this.$refs["my_keyboard"].offsetWidth;
            this.main_height = this.$refs["my_keyboard"].offsetHeight;
          });
        }
        // this.$emit("set_mode", val);
      }
    }
  },
  methods: {
    showKeyBoard(e) {
      this.input = e.target;
      this.show = true;
      this.mode = e.target.dataset.mode;
      if (this.input && this.float) {
        let bound = this.input.getBoundingClientRect();
        let toptop = document.documentElement.scrollTop;
        this.st = {
          position: "absolute",
          left: "0",
          "z-index": "10",
          bottom:"0"
		  //top: bound.y + bound.height + 10 + toptop + "px"
        };
      }
    },
    HideKey(e) {
      this.show = false;
      this.input.blur();
    },
    mousedown(e) {
      // console.log(this.input);
      e.preventDefault();
    },
    /**手写选择文字*/
    HandText(text) {
      if (this.input !== document.activeElement) return;
      let index = this.input.selectionStart;
      this.input.value = this.insertString(this.input.value, text, index);
      this.TheEnd(index + 1);
      //触发input事件
      this.input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    //点击按钮
    clickKey(e, key, pass) {
      if (this.input !== document.activeElement) return;
      let index = this.input.selectionStart;
      e.preventDefault();
      if (this.mode === "cn" && !pass) {
        this.cn_input += key;
        this.l_min = 0;
        this.l_max = 12;

        let re = new RegExp(`^${this.cn_input}\\w*`);
        let keys = Object.keys(dict)
          .filter(key => re.test(key))
          .sort();
        // console.log(keys);
        this.cn_list_str =
          keys.length > 1
            ? keys.reduce((a, b) => a + dict[b], "")
            : dict[keys[0]]; //dict[this.cn_input];
      } else {
        // this.input.value += key;
        this.input.value = this.insertString(this.input.value, key, index);
        this.TheEnd(index + 1);
      }
      //触发input事件
      this.input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    clickNumber(e, key) {
      if (this.input !== document.activeElement) return;
      let index = this.input.selectionStart;
      e.preventDefault();
      if (this.mode === "cn" && this.cn_input !== "") {
        this.input.value += this.cut_cn_list[parseInt(key) - 1];
        this.cn_input = "";
        this.cn_list_str = "";
      } else {
        // this.input.value += key;
        this.input.value = this.insertString(this.input.value, key, index);
        this.TheEnd(index + 1);
      }
      //触发input事件
      this.input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    clickCN(e, text) {
      let index = this.input.selectionStart;
      e.preventDefault();
      // this.input.value += text;
      this.input.value = this.insertString(this.input.value, text, index);
      this.cn_input = "";
      this.cn_list_str = "";
      //触发input事件
      this.input.dispatchEvent(new Event("input", { bubbles: true }));
      this.TheEnd(index + 1);
    },
    del() {
      if (this.input !== document.activeElement) return;
      let index = this.input.selectionStart;
      if (this.mode === "cn" && this.cn_input !== "") {
        this.cn_input = this.delStringLast(
          this.cn_input,
          this.cn_input.length - 1
        );
        this.l_min = 0;
        this.l_max = 12;
        this.cn_list_str = dict[this.cn_input];
      } else {
        this.input.value = this.delStringLast(this.input.value, index - 1);
        this.TheEnd(index - 1);
      }
      //触发input事件
      this.input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    /**字符串插入文字 */
    insertString(text, input, index) {
      let arrText = text.split("");
      arrText.splice(index, 0, input);
      return arrText.join("");
    },
    /**删除字符串的某个字符*/
    delStringLast(text, index) {
      let arrText = text.split("");
      arrText[index] = "";
      // arrText.pop();
      return arrText.join("");
    },
    /**光标归位*/
    TheEnd(index) {
      this.input.selectionStart = index;
      this.input.selectionEnd = index;
    },
    cap_change() {
      if (this.mode !== "cn") {
        this.mode = this.mode === "en_cap" ? "en_let" : "en_cap";
      }
    },
    cn_change() {
      this.mode = this.mode === "cn" ? "en_cap" : "cn";
      this.cn_input = "";
      this.cn_list_str = "";
    },
    num_change() {
      this.mode = "num";
    },
    bd_change() {
      this.mode = "biaodian";
    },
    Fanhui() {
      this.mode = this.old_mode;
    },
    previous_page() {
      if (this.l_min > 0) {
        this.l_min = this.l_min - 12;
        this.l_max = this.l_max - 12;
      }
    },
    next_page() {
      if (this.cn_list.length > this.l_max) {
        this.l_min += 12;
        this.l_max += 12;
      }
    }
  }
};
</script>


<style lang="scss" scoped>

i {
  font-style: normal;
}
.num-del > svg {
  margin-top: 10px;
}
.def-del > svg {
  margin-top: 0px;
}
.hand-del > svg {
  margin-top: 0px;
}
.my-keyboard {
  width: 100%;
  min-width: 1024px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .pinyin,
  .select-list {
    > div {
      width: 1024px;
      margin: 0 auto;
    }
  }
  .pinyin {
    height: 30px;
    background: #fff;
    border: 1px solid rgba(209, 209, 209, 1);
    padding: 0 20px;
    text-align: left;
    > div span {
      font-size: 20px;
      line-height: 30px;
      font-weight: bold;
    }
  }
  .select-list {
    height: 40px;
    background: #fff;
    border: 1px solid rgba(209, 209, 209, 1);
    border-top: none;
    padding: 0 20px;
    text-align: left;
    > div {
      position: relative;
    }
    .select-text {
      cursor: pointer;
      line-height: 40px;
      font-size: 24px;
      font-weight: bold;
      & + .select-text {
        margin-left: 15px;
      }
    }
    .page {
      position: absolute;
      top: 0;
      right: 0px;
      width: 120px;
      height: 40px;
      .previous {
        transform: scaleX(2) rotate(180deg);
      }
      > p {
        margin-top: 0px;
        margin-bottom: 0px;
        display: inline-block;
        text-align: center;
        transform: scaleX(2);
        width: 30px;
        height: 38px;
        line-height: 38px;
        background: #344a5d;
        color: #fff;
        border: 1px solid #d7d7d7;
        border-radius: 5px;
        cursor: pointer;
        &:active {
          background: #fff;
          color: #344a5d;
        }
        & + p {
          margin-left: 30px;
        }
      }
    }
  }
  .main-keyboard {
    padding: 0 14px;
    background: #e6e6e6;
    height: 305px;
    .key {
      height: 50px;
      line-height: 50px;
      font-size: 24px;
      font-weight: 700;
      width: 80px;
      background: #fff;
      display: inline-block;
      vertical-align: middle;
      border-radius: 8px;
      margin-top: 8px;
      box-shadow: 1px 1px 2px rgba(20, 20, 20, 0.3);
      cursor: pointer;
      &:active {
        background: #d0d0d0;
      }
      & + .key {
        margin-left: 10px;
      }
    }
    .number-box {
      width:720px;
      display: inline-block;
      vertical-align: middle;
    }
    .del-box {
      width: 260px;
      display: inline-block;
      vertical-align: middle;
      .key {
        margin-left: 0px;
      }
    }
    .hand-left-box {
      width: 155px;
      display: inline-block;
      vertical-align: middle;
      .key {
        margin-left: 0px;
        //margin-top: 20px;
        &:nth-of-type(1) {
          margin-top: 0px;
        }
      }
      > span {
        width: 140px;
      }
    }
    .number {
      width: 210px;
      height: 65px;
      font-size: 56px;
      line-height: 65px;
      &:nth-last-of-type(3n) {
        margin-left: 0px;
      }
    }
    .cap_change {
      width: 140px;
      color: #fff;
      background: #344a5d;
      &:active {
        background: #728fa8;
      }
    }
    .key_hide {
      background: #d6d1d0;
      > .jp {
        height: 50px;
        display: inline-block;
        vertical-align: middle;
      }
      > span {
        padding-left: 10px;
        font-size: 18px;
        line-height: 18px;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .blue {
      color: #fff;
      background: #344a5d;
      &:active {
        background: #728fa8;
      }
    }
    .red {
      color: #fff;
      background: #f56c6c;
      &:active {
        background: #f89e9e;
      }
    }
    .space {
      width:205px;
    }
  }
}
</style>
