<template>
  <div class="chat-window">
    <div class="chat-window-head">
      <span class="chat-window-head-back" v-on:click="goBack()">Back</span>
      <span class="chat-window-head-name">{{name}}</span>
    </div>
    <div class="chat-window-content">
      <div class="chat-window-content-bubble chat-window-content-bubble-right">
        <chat-bubble :direction="'right'">111</chat-bubble>
      </div>
      <div class="chat-window-content-bubble chat-window-content-bubble-left">
        <chat-bubble :direction="'left'">222</chat-bubble>
      </div>
    </div>
    <div class="chat-window-handle">
      <div class="chat-window-handle-fun" v-on:click="creatAudio()">+</div>
      <span class="chat-window-handle-circle-left"></span>
      <div class="chat-window-handle-input">
        <input>
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
      AudioBufferSourceNode: null
    };
  },
  created() {
    const { api } = this.$router.history.current.query;
    this.api = api;
    this.getContent();
  },
  methods: {
    goBack() {
      this.$router.push("/chat-list");
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
