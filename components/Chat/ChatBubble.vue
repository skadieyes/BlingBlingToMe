<!-- 聊窗-聊天气泡容器 -->

<template>
  <div
    :class="{
            'chat-bubble' : true,
            'chat-bubble-right': direction === 'right',
            'chat-bubble-left':  direction === 'left',
            }"
  >
    <div class="chat-bubble-loading" v-if="showLoadding">
      <div class="chat-bubble-loading-item" v-for="item in loadingModel" :key="item">
        <font-awesome-icon
          icon="circle"
          :class="{'chat-bubble-loading-item-icon': true,
        'chat-bubble-loading-item-icon-active': item === activeBub, }"
        />
      </div>
    </div>
    <slot v-if="!showLoadding"></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "聊天气泡组件",
      loadingModel: [0, 1, 2],
      activeBub: 0, // 活跃的
      timer: null, // 气泡的定时器
      bubNumber: 0,
      showLoadding: false, // 是否显示loadding
    };
  },
  props: {
    direction: "" // 气泡的方向 left right
  },
  created() {
  },
  methods: {
    // 开始跑定时器泡泡
    bubbling() {
      const bubMax = this.loadingModel.length - 1;
      this.timer = setInterval(() => {
        if (this.activeBub === this.loadingModel[bubMax]) {
          this.activeBub = 0;
          this.bubNumber = this.bubNumber + 1;
        } else {
          this.activeBub = this.activeBub + 1;
        }
        if (this.bubNumber > 2) {
          clearInterval(this.timer);
        }
      }, 1000);
    },
    // 清除气泡的定时器
    stopBubbling() {
      clearInterval(this.timer);
    }
  }
};
</script>

<style lang="stylus" scoped>
.chat-bubble {
  background-color: #fff;
  padding: 1rem 2rem;
  font-size: 0.95rem;
  width: auto;
  display: inline-block;
  color: #262626;

  &-loading {
    display: flex;

    &-item {
      font-size: 0.75rem;
      padding: 0 0.15rem;

      &-icon {
        color: rgba(255, 255, 255, 0.5);
      }

      &-icon-active {
        color: rgba(255, 255, 255, 1);
      }
    }
  }
}

.chat-bubble-right {
  border-radius: 1.25rem 2.5rem 0 1.25rem;
  background: linear-gradient(90deg, #ff85c0, #ffd6e7);
}

.chat-bubble-left {
  border-radius: 2.5rem 1.25rem 1.25rem 0;
  background: linear-gradient(90deg, #efdbff, #d3adf7);
}
</style>
