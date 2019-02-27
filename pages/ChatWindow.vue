<template>
  <div class="chat-window">
    <div class="chat-window-head">
      <span class="chat-window-head-back" v-on:click="goBack()">Back</span>
      <span class="chat-window-head-name">{{name}}</span>
    </div>
    <div class="chat-window-content">
      <div class="chat-window-content-bubble chat-window-content-bubble-right">
        <chat-bubble :direction="'right'">你想获得真正的力量吗</chat-bubble>
      </div>
      <div class="chat-window-content-bubble chat-window-content-bubble-left">
        <chat-bubble :direction="'left'">来选一首歌吧</chat-bubble>
      </div>
      <div class="chat-window-content-bubble chat-window-content-bubble-right">
        <chat-bubble :direction="'left'">
          <canvas id="smile-face" ref="smile_face"></canvas>
        </chat-bubble>
      </div>
    </div>
    <div class="chat-window-handle">
      <div class="chat-window-handle-fun" v-on:click="playAudioBuffer()">+</div>
      <span class="chat-window-handle-circle-left"></span>
      <div class="chat-window-handle-input">
        <input id="loadfile" type="file" v-on:change="getAudioFile">
      </div>
      <span class="chat-window-handle-circle-right"></span>
      <span class="chat-window-handle-send">></span>
    </div>
  </div>
</template>

<script>
import ChatBubble from "@/components/Chat/ChatBubble";

export default {
  name: "chat-window",
  components: { ChatBubble },
  computed: {},
  data() {
    return {
      name: "聊天窗",
      api: [], // 获取当前聊天窗数据的接口
      name: "", // 和你聊天的人
      describe: "", // 描述
      action: [], // 这个人的若干行为
      direction: "left", // 方向
      audioCtx: null, // 音频环境
      AudioBufferSourceNode: null,
      document: null, // 上传的音频文件
      buffer: null, // ArrayBuffer类型的音频数据
      analyserNode: null, // 音频可视化节点
      analyserData: null, // 音频可视化数据
      ctx: null, // 画布对象
      ctxWidth: 200,
      ctxHeight: 150,
      size: 160,
      arcX: 60,
      arcY: 60,
      arcR: 60
    };
  },
  created() {
    const { api } = this.$router.history.current.query;
    this.api = api;
    this.getContent();
    this.creatAudio();
  },
  mounted() {
    this.initCanvas();
    this.drawLine();
    console.log(this.getPoints());
  },
  methods: {
    goBack() {
      this.$router.push("/chat-list");
    },
    // 获取圆上的所有点
    getPoints() {
      const points = [];
      for (let i = 0; i < this.size / 2; i = i + 1) {
        const x = i * 2 * ((2 * this.arcR) / this.size);
        const y1 = (
          this.arcY -
          Math.sqrt(Math.pow(this.arcR, 2) - Math.pow(x - this.arcX, 2))
        ).toFixed(2);
        const y2 = (
          Math.sqrt(Math.pow(this.arcR, 2) - Math.pow(x - this.arcX, 2)) +
          this.arcY
        ).toFixed(2);
        const arc1 = Math.asin(x * (Math.sin(90) / this.arcR));
        const arc2 = Math.asin(x * (Math.sin(90) / this.arcR));
        console.log(arc);
        points.push({ x, y: y1 }, { x, y: y2 });
      }
      return points;
    },
    // 获取线段终点
    getLineTo(angle, R) {
      const lineToX = Math.sin(angle) * ( R /  Math.sin(90) );
      const lineToY =  Math.sqrt(Math.pow(R, 2) - Math.pow(lineToX, 2));
      return { lineToX, lineToY };
    },
                                   drawSmileFace() {
      if (!this.ctx) return;
      this.ctx.beginPath();
      this.ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // 绘制
      this.ctx.moveTo(110, 75);
      this.ctx.arc(75, 75, 35, 0, Math.PI, false); // 口(顺时针)
      this.ctx.moveTo(65, 65);
      this.ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // 左眼
      this.ctx.moveTo(95, 65);
      this.ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // 右眼
      this.ctx.stroke();
    },
    // 绘制线条
    drawLine() {
      // 设置渐变色
      this.line = this.ctx.createLinearGradient(0, 0, 0, this.ctxHeight); //线性渐变
      this.line.addColorStop(0, "red");
      this.line.addColorStop(0.5, "orange");
      this.line.addColorStop(1, "green");
    },
    // 绘制音频可视化
    drawAudio(points) {
      this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight);
      this.ctx.fillStyle = this.line;

      const rectWidth = this.ctxWidth / this.size;
      const cw = rectWidth * 0.6;
      const coordinate = this.getPoints();
      for (let i = 0; i < this.size; i++) {
        const rectHeight = (points[i] / 256) * this.ctxHeight; //音频数据最大值256
        // 绘制矩形条（x,y,width,height）; rectWidth*0.6使矩形之间有间隙
        this.ctx.fillRect(coordinate[i].x, coordinate[i].y, cw, rectHeight);
      }
    },
    initCanvas() {
      const element = this.$refs.smile_face;
      element.width = this.ctxWidth;
      element.height = this.ctxHeight;
      if (!element.getContext) return;
      this.ctx = element.getContext("2d");
    },
    getContent() {
      this.$http
        .get(`/static/db/${this.api}.json`)
        .then(({ body }) => {
          const { name, describe, action } = body;
          this.name = name;
          this.describe = describe;
          this.action = action;
        })
        .catch(error => {
          console.log(error);
        });
    },
    creatAudio() {
      this.audioCtx = new AudioContext();
      this.AudioBufferSourceNode = this.audioCtx.createBufferSource();
      this.audioCtx.resume().then(() => {
        console.log("Playback resumed successfully");
      });
    },
    // 获取音频文件
    getAudioFile(e) {
      const { files } = e.target;
      const file = files[0];
      this.decodeAudioToGetBuffer(file);
    },
    // 解码音频冰获取ArrayBuffer类型的数据
    decodeAudioToGetBuffer(file) {
      const fr = new FileReader();
      fr.onload = e => {
        this.audioCtx.decodeAudioData(
          e.target.result,
          buffer => {
            this.buffer = buffer;
          },
          function(err) {
            console.log(err);
          }
        );
      };
      fr.readAsArrayBuffer(file);
    },
    // 初始化音频可视化相关配置
    initAnalyserNode() {
      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserData = new Uint8Array(this.analyserNode.frequencyBinCount);
    },
    // 开始进行音频数据分析
    getAnalyser() {
      this.analyserNode.getByteFrequencyData(this.analyserData); // 将音频频域数据复制到传入的Uint8Array数组
      this.drawAudio(this.analyserData);
      requestAnimationFrame(this.getAnalyser);
    },
    // 播放音频数据
    playAudioBuffer() {
      this.initAnalyserNode();
      this.getAnalyser();
      this.AudioBufferSourceNode.buffer = this.buffer; // AudioBuffer数据赋值给buffer属性
      this.AudioBufferSourceNode.connect(this.audioCtx.destination); // 如果只是播放音频，这边就直接将AudioBufferSourceNode连接到AudioDestinationNode
      this.AudioBufferSourceNode.connect(this.analyserNode); // 实现播放后，需要将bufferSourceNode连接到AnalyserNode，才能通过AnalyserNode获取后面可视化所需的数据
      this.AudioBufferSourceNode.loop = true; // 循环播放，默认为false
      this.AudioBufferSourceNode.start(0); // 开始播放音频
    }
  }
};
</script>

<style lang="stylus" scoped>
.chat-window {
  &-head {
    height: 4rem;
    font-size: 1rem;
    line-height: 4rem;
    background: linear-gradient(90deg, #ff85c0, #d3adf7);
    color: #fff;
    font-family: Helvetica;
    box-shadow: 2px 2px 3px #aaaaaa;
    z-index: 10;
    position: absolute;
    width: 100%;
    box-shadow: 0 2px 25px #ffadd2;
    text-align: left;
    padding-left: 1rem;
    position: relative;

    &-name {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
      font-size: 1.1rem;
      font-weight: 800;
    }
  }

  &-content {
    position: absolute;
    top: 4rem;
    bottom: 4rem;
    width: 100%;
    background-color: #fff1f0;
    padding: 1rem 0;
    overflow-y: auto;

    &-bubble {
      padding: 0 1rem 1rem;
    }

    &-bubble-right {
      text-align: right;
    }

    &-bubble-left {
      text-align: left;
    }
  }

  &-handle {
    position: fixed;
    bottom: 0;
    height: 4rem;
    border-radius: 4px;
    width: 100%;
    background-color: #fff1f0;
    box-shadow: 0 -1px 20px #ff85c0;
    display: flex;
    align-items: center;
    padding: 0 1rem;

    &-fun {
      width: 2.5rem;
      height: 2.5rem;
      line-height: 2.5rem;
      background: linear-gradient(90deg, #ff85c0, #d3adf7);
      border-radius: 50%;
      color: #fff;
      margin-right: 1rem;
      box-shadow: 1px 0px 10px #ff85c0;
    }

    &-input {
      background-color: #fff;
      height: 2.3rem;
      width: 13rem;

      input {
        border: none;
        height: 2rem;
        width: 12rem;
        outline: none;
        color: #f759ab;
      }
    }

    &-circle-left {
      width: 2.3rem;
      height: 2.3rem;
      border-radius: 1.15rem 0 0 1.15rem;
      background-color: #fff;
    }

    &-circle-right {
      width: 2.3rem;
      height: 2.3rem;
      border-radius: 0 1.15rem 1.15rem 0;
      background-color: #fff;
    }

    &-send {
      width: 2.3rem;
      height: 2.3rem;
      background-color: #fff;
      border-radius: 50%;
      position: absolute;
      right: 3.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #f759ab;
    }
  }
}
</style>
