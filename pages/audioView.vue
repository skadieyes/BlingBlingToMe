<template>
  <div class="audio">
    <div class="audio-content">
      <canvas id="smile-face" ref="smile_face"></canvas>
    </div>
    <div class="audio-title">
      play songs
      <span class="audio-songs-labels">{{labels}}</span>
      <div class="audio-songs">
        <div class="audio-songs-area">
          <span class="audio-songs-area-label">select mp3</span>
          <input
            class="audio-songs-area-input"
            id="loadfile"
            type="file"
            v-on:change="getAudioFile"
          >
        </div>
        <div class="audio-songs-play">
          <button
            class="audio-songs-play-btn"
            v-if="buffer && !playMusic"
            v-on:click="playAudioBuffer()"
          >play</button>
        </div>
        <div>
        </div>
      </div>
     <div class="audio-name">
        <div>音频可视化/Audio visualization</div>
        <div>选择一首mp3, 然后播放它吧</div>
        <div>Choosing a songs and playing it, you will see the sunshine</div>
    </div>
    </div>
    <div class="audio-github" @click="openGit">
        <img src="static/img/github.png" />
        <div class="audio-github-name">skadyeyes</div>
    </div>
  </div>
</template>

<script>
import ChatBubble from "@/components/Chat/ChatBubble";

export default {
  name: "audio",
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
      waveCtx: null, // 波浪的画布
      ctxWidth: 500,
      ctxHeight: 500,
      size: 40,
      arcX: 120,
      arcY: 120,
      arcR: 120,
      offSet: 60,
      playMusic: false, // 是否正在播放音乐
      labels: null,
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
    this.drawSmileFace();
  },
  methods: {
    goBack() {
      this.$router.push("/chat-list");
    },
    // 获取圆上的所有点
    getPoints() {
      const points = [];
      for (let i = 0; i <= this.size / 2; i = i + 1) {
        // const x = i * 2 * ((2 * this.arcR) / this.size);
        const x =
          this.arcR - Math.cos((2 * Math.PI * i) / this.size) * this.arcR;
        const y1 = (
          this.arcY -
          Math.sqrt(Math.pow(this.arcR, 2) - Math.pow(x - this.arcX, 2))
        ).toFixed(2);
        const y2 = (
          Math.sqrt(Math.pow(this.arcR, 2) - Math.pow(x - this.arcX, 2)) +
          this.arcY
        ).toFixed(2);
        const arc1 = Math.asin(x * (Math.sin(Math.PI / 2) / this.arcR));
        const arc2 = Math.asin(x * (Math.sin(Math.PI / 2) / this.arcR));
        points.push({ x, y: y1 }, { x, y: y2 });
      }
      return points;
    },
    // 获取线段终点
    getLineTo(angle, R) {
      const lineToX = Math.sin(angle) * (R / Math.sin(Math.PI / 2));
      const lineToY = Math.sqrt(Math.pow(R, 2) - Math.pow(lineToX, 2));
      return { lineToX, lineToY };
    },
    openGit(){
        window.open('https://github.com/skadieyes/BlingBlingToMe')
    },
    drawSmileFace() {
      if (!this.ctx) return;
      this.ctx.beginPath();
      this.ctx.arc(
        this.arcX + this.offSet,
        this.arcY + this.offSet,
        this.arcR,
        0,
        Math.PI * 2,
        true
      ); // 绘制
      this.ctx.moveTo(
        2 * this.arcX + this.offSet - 15,
        this.arcX + this.offSet
      );
      this.ctx.arc(
        this.arcR + this.offSet,
        this.arcR + this.offSet,
        this.arcR - 15,
        0,
        Math.PI,
        false
      ); // 口(顺时针)
      this.ctx.moveTo(
        this.arcR + this.offSet - 5,
        this.arcR + this.offSet - 15
      );
      this.ctx.arc(
        this.arcR + this.offSet - 10,
        this.arcR + this.offSet - 15,
        5,
        0,
        Math.PI,
        true
      ); // 左眼
      this.ctx.moveTo(
        this.arcR + this.offSet + 15,
        this.arcR + this.offSet - 15
      );
      this.ctx.arc(
        this.arcR + this.offSet + 10,
        this.arcR + this.offSet - 15,
        5,
        0,
        Math.PI,
        true
      ); // 右眼
      this.ctx.stroke();
    },
    /*     drawWave() {
      this.waveCtx.beginPath();
      this.waveCtx.moveTo(20, 170);
      this.waveCtx.quadraticCurveTo(130, 40, 210, 170);
      this.waveCtx.strokeStyle = "blue";
      this.waveCtx.stroke();
    }, */
    // 绘制线条
    drawLine() {
      // 设置渐变色
      this.line = this.ctx.createLinearGradient(0, 0, 0, this.ctxHeight); //线性渐变
      this.line.addColorStop(0, "#f5222d");
      this.line.addColorStop(0.5, "#ffbb96");
      this.line.addColorStop(1, "#fff566");
    },
    // 绘制音频可视化
    drawAudio(points) {
      this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight);
      this.ctx.fillStyle = this.line;

      const rectWidth = 200 / this.size;
      const cw = rectWidth * 0.6;
      const coordinate = this.getPoints();
      for (let i = 0; i <= this.size; i++) {
        const rectHeight = (points[i] / 256) * 60; //音频数据最大值256
        // 绘制矩形条（x,y,width,height）; rectWidth*0.6使矩形之间有间隙
        this.ctx.beginPath();
        const moveTox = coordinate[i].x + this.offSet;
        const moveToy = Number(coordinate[i].y) + this.offSet;
        this.ctx.moveTo(moveTox, moveToy);
        let lineTox;
        let lineToy;
        const Rx = this.arcX + this.offSet;
        const Ry = this.arcY + this.offSet;
        if (coordinate[i].x > this.arcR) {
          lineTox =
            ((this.arcR + rectHeight) / this.arcR) * (moveTox - Rx) + Rx;
        }
        if (Number(coordinate[i].y) > this.arcR) {
          lineToy =
            ((this.arcR + rectHeight) / this.arcR) * (moveToy - Ry) + Ry;
        }
        if (coordinate[i].x < this.arcR) {
          lineTox =
            Rx - ((this.arcR + rectHeight) / this.arcR) * (Rx - moveTox);
        }
        if (Number(coordinate[i].y) < this.arcR) {
          lineToy =
            Ry - ((this.arcR + rectHeight) / this.arcR) * (Ry - moveToy);
        }
        if (coordinate[i].x === this.arcR) {
          lineTox = Rx;
          if (Number(coordinate[i].y) < this.arcR) {
            lineToy = moveToy - rectHeight;
          } else {
            lineToy = Ry + this.arcR + rectHeight;
          }
        }
        if (Number(coordinate[i].y) === this.arcR) {
          lineToy = Ry;
          if (coordinate[i].x < this.arcR) {
            lineTox = moveTox - rectHeight;
          } else {
            lineTox = Rx + this.arcR + rectHeight;
          }
        }
        this.ctx.lineTo(lineTox, lineToy);
        this.ctx.lineWidth = 5;
        //Line Color 线条/直线颜色
        this.ctx.strokeStyle = this.line; //设置或返回用于笔触的颜色、渐变
        this.ctx.stroke();
      }
    },
    initCanvas() {
      const element = this.$refs.smile_face;
      element.width = this.ctxWidth;
      element.height = this.ctxHeight;
      if (!element.getContext) return;
      this.ctx = element.getContext("2d");
    },
    initWave() {
      const element = this.$refs.wave;
      element.width = this.waveCtxWidth;
      element.height = this.waveCtxHeight;
      if (!element.getContext) return;
      this.waveCtx = element.getContext("2d");
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
      return new Promise(resolve => {
        this.audioCtx = new AudioContext();
        this.buffer = null;
        if (this.playMusic) {
          this.AudioBufferSourceNode.stop();
          this.playMusic = false;
        }
        this.AudioBufferSourceNode = this.audioCtx.createBufferSource();
        this.audioCtx.resume().then(() => {
          resolve();
        });
      });
    },
    // 获取音频文件
    getAudioFile(e) {
      const { files } = e.target;
      const file = files[0];
      if (file.type !== "audio/mp3") {
        this.labels = "你选的不是mp3诶";
        return;
      } else {
        const { name } = file;
        this.labels = name;
        // 先创建上下文环境
        this.creatAudio().then(() => {
          this.decodeAudioToGetBuffer(file);
        });
      }
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
      if (!this.playMusic) return;
      this.analyserNode.getByteFrequencyData(this.analyserData); // 将音频频域数据复制到传入的Uint8Array数组
      this.drawAudio(this.analyserData);
      this.drawSmileFace();
      requestAnimationFrame(this.getAnalyser);
    },
    // 播放音频数据
    playAudioBuffer() {
      this.playMusic = true;
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
.audio {
  position: absolute;
  top: 0;
  width: 100%;
  background: linear-gradient(#f48fb1, #69c0ff);

  &-title {
    font-size: 1rem;
    color: #fff;
    position: absolute;
    left: 50%;
    transform: translateX(-20%);
    top: 4rem;
    font-size: 32px;
  }

  &-songs {
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &-area {
      display: flex;
      padding-top: 1rem;
      background: linear-gradient(90deg, #ff85c0, #d3adf7);
      box-shadow: 1px 1px 5px #888;
      color: #fff;
      width: 120px;
      text-align: center;
      font-size: 16px;
      line-height: 32px;
      border-radius: 4px;
      cursor: pointer;
      position: relative;

      &-input {
        opacity: 0;
      }

      &-label {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
      }
    }

    &-play {
      &-btn {
        display: flex;
        margin-top: 10px;
        border: none;
        background: linear-gradient(90deg, #ff85c0, #ffe58f);
        box-shadow: 1px 1px 5px #888;
        width: 120px;
        color: #fff;
        width: 120px;
        font-size: 16px;
        line-height: 32px;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        justify-content: center;
      }
    }

    &-labels {
      margin: 10px 0;
      font-size: 14px;
    }
  }

  &-content {
    padding: 1rem 0;
    display: flex;
    padding-left: 30px;

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

  &-bottom {
    position: absolute;
    bottom: 0;
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
  &-name{
    padding-top: 1rem;
    font-size: 1rem;
    text-align: left;
    width: 30rem;
    position: absolute;
    line-height: 2rem;
    opacity: 0.8;
  }
  &-github{
      position: absolute;
      right: 1rem;
      top: 1rem;
      cursor: pointer;
      img{
        width: 3rem;
      }
      &-name{
          color: #e6e6e6;
      }
  }
}
</style>
