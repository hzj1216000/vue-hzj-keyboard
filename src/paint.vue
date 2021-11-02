<template>
  <div class="keyboard-paint" style="margin-top:5px;">
    <div class="canvas-box">
      <canvas
        :width="p_width*0.4"
        :height="p_height-30"
        ref="canvas"
        @touchstart="Down"
        @touchmove="Move"
        @touchend="Mouseup"
		@mousedown="Down"
		@mousemove="Move"
		@mouseup="Mouseup"		
        @mouseleave="Leave"
      ></canvas>
      <!-- @touchstart="Down"
        @touchmove="Move"
      @touchend="Mouseup"-->
    </div>
    <table class="result-table">
      <tr v-for="(item, index) in write_result" :key="index">
        <td @click="Select(text)" v-for="(text, index) in item" :key="index">{{text}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  mounted() {
    //this.SwitchLib(this.lib);
    let _this = this;
    this.$nextTick(() => {
      _this.ctx = _this.$refs.canvas.getContext("2d");
      //console.log(_this.ctx);

      _this.Reload();
      let bound = _this.$refs.canvas.getBoundingClientRect();
      _this.X = bound.x;
      _this.Y = bound.y;
      // window.onscroll = _this.UpdateBound
      window.addEventListener("scroll", _this.UpdateBound);
    });
    this.write_result = [];
    // console.log(this.write_result);
  },
  beforeDestroy() {
    //清除监听
    window.removeEventListener("scroll", this.UpdateBound);
  },
  props: {
    p_width: [String, Number],
    p_height: [String, Number],
    lib: {
      type: String,
      default: "CN"
    }
  },
  data() {
    return {
      write_result_temp: [],
      isClick: false,
      //轨迹X
      clickX: [],
      //轨迹Y
      clickY: [],
      //轨迹标志位，为1则是终点
      clickC: [],
	  deltaX:[],
	  deltaY:[],
	  deltaXY:[],
	  path:[],
      X: 0,
      Y: 0,
      old_X: 0,
      old_Y: 0,
      tiemr: 0,
      ctx: null
    };
  },
  watch: {
    lib(val) {
      this.SwitchLib(val);
    }
  },
  computed: {
    write_result: {
      get() {
		console.log(this.write_result_temp);
        return this.write_result_temp;
      },
      set(val) {
        let ll = val.length;
        if (ll < 9) {
          for (let i = 0; i < 12 - ll; i++) {
            val.push("");
          }
        } else if (ll > 9) {
          for (let i = 0; i < ll - 12; i++) {
            val.pop();
          }
        }
        this.write_result_temp = [
          val.slice(0, 3),
          val.slice(3, 6),
          val.slice(6, 9)
        ];
      }
    }
  },
  methods: {
    //更新bound
    UpdateBound() {
      let bound = this.$refs.canvas.getBoundingClientRect();
      this.X = bound.x;
      this.Y = bound.y;
    },
	GetCx(ev) {
	  return Math.floor(
	    (ev.clientX ||ev.targetTouches[0].clientX) - this.X
	  );
	},	
	GetCy(ev) {
	  return Math.floor(
	    (ev.clientY || ev.targetTouches[0].clientY) - this.Y
	  );
	},
    //重新加载字体库
    SwitchLib(val) {
      switch (val) {
        case "CN":
          console.log("加载中文库");
          //加载中文库
          //this.handWrite.createCN();
          break;
        case "EN":
          console.log("加载英文库");
          //加载英文库
          //this.handWrite.createEN();
          break;
        default:
          break;
      }
    },
    Down(e) {
      // console.log(`${e.clientX - this.X},${e.clientY -this.Y}`);
      // window.eee = e
	  let cx = this.GetCx(e);
	  let cy = this.GetCy(e);
      clearTimeout(this.timer);
      this.old_X = cx;
      this.old_Y = cy;
	  this.deltaX = [];
	  this.deltaY=[];
	  this.deltaXY=[];	  
	  this.deltaXY.push(this.old_X);
	  this.deltaXY.push(this.old_Y);
      let ctx = this.$refs.canvas.getContext("2d");
      console.log(ctx);

      ctx.beginPath();
      this.isClick = true;
    },
    Move(e) {
      if (this.isClick) {
		let cx = this.GetCx(e);
		let cy = this.GetCy(e);
        this.clickX.push(cx);
        this.clickY.push(cy);
        this.clickC.push(0);
		this.deltaXY.push(cx-this.old_X);
		this.deltaXY.push(cy-this.old_Y);
        //画图
        let ctx = this.$refs.canvas.getContext("2d");
        // console.log(ctx);
        ctx.strokeStyle = "#000";
        ctx.fillStyle = "#000";
        //演示关键点
        // ctx.beginPath();
        // ctx.arc(e.clientX - this.X, e.clientY - this.Y, 5, 0, Math.PI*2, false);
        // ctx.fill()
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.moveTo(this.old_X, this.old_Y);
        ctx.lineTo(cx,cy);
        ctx.stroke();
        this.old_X = cx;
        this.old_Y = cy;
      }
    },
    //targetTouches[0]
    Mouseup(e) {
      // console.log("滑动结束");
      if (this.isClick) {
        this.isClick = false;
        let _this = this;
        this.timer = setTimeout(() => {
          _this.Reload();
        }, 1500);
        //标记最后一点为终点
        this.clickC.pop();
		this.path.push(this.deltaXY);
        this.clickC.push(1);
        this.GetText();
      }
    },
    Leave(e) {
      if (this.isClick) {
        this.isClick = false;
        let _this = this;
        this.timer = setTimeout(() => {
          _this.Reload();
        }, 1000);
        //标记最后一点为终点
        this.clickC.pop();
		this.path.push(this.deltaXY);
        this.clickC.push(1);
        this.GetText();
      }
    },
    //初始化
    Reload() {
      this.clickX = [];
      this.clickY = [];
      this.clickC = [];
	  this.deltaX = [];
	  this.deltaY=[];
	  this.deltaXY=[];
	  this.path = [];
      let ctx = this.$refs.canvas.getContext("2d");
      ctx.clearRect(0, 0, this.p_width, this.p_height - 10);
      ctx.fillStyle = "rgba(238,111,111,0.2)";
      ctx.font = "bold 80px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "手写区域",
        this.$refs.canvas.width / 2,
        this.$refs.canvas.height / 2,
        [1000]
      );
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#aaa";
      ctx.beginPath();
      ctx.moveTo(0, this.$refs.canvas.height / 2);
      ctx.lineTo(this.$refs.canvas.width, this.$refs.canvas.height / 2);
      ctx.stroke();
      ctx.moveTo(this.$refs.canvas.width / 2, 0);
      ctx.lineTo(this.$refs.canvas.width / 2, this.$refs.canvas.height);
      ctx.stroke();
      ctx.setLineDash([0, 0]);
    },
	ajax_callback:function(X){
		console.log(X);
		this.write_result  = X.cand;
	},
    //获取文字
    GetText() {
	  let Z = "";
	  var ad = "";
	  for (var X = 0; X < this.path.length; ++X) {
	  		  var ac = this.path[X];
	  		  ad = X ? ",eb,": "";
	  		  var Y = ad + ac.join(",");
	  		  Z += Y
	  }
	  let url = "http://handwriting.shuru.qq.com/cloud/cgi-bin/cloud_hw_pub.wsgi";
	  url = url +"?"+"track_str=" + Z + "&cmd=0";
	  QQShuru.HWPanel.ajax_callback = this.ajax_callback;
	  QQShuru.get(url, "QQShuru.HWPanel.ajax_callback");
      
    },
    //选择文字
    Select(text) {
      this.$emit("SelectText", text);
      this.write_result = [];
      this.Reload();
      clearTimeout(this.timer);
    }
  }
};
</script>

<style lang="scss" scoped>
.keyboard-paint {
  display: inline-block;
  vertical-align: middle;
  .canvas-box {
    display: inline-block;
    vertical-align: middle;
    background: #fff;
    font-size: 0px;
    #canvas {
      border: 1px solid #aaa;
    }
  }
  .result-table {
    display: inline-block;
    vertical-align: middle;
    margin-left: 8px;
    td {
      border: 1px solid #aaa;
      width: 110px;
      height: 90px;
      font-size: 40px;
      font-weight: bold;
      background: #fff;
      font-family: simsun;
      &:active {
        background: #aaa;
      }
    }
  }
}
</style>
