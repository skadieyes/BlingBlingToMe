<!-- 聊天列表-聊天项 -->

<template>
  <div class="chat-item">
    <div class="chat-item-photo"></div>
    <div class="chat-item-label">
      <div class="chat-item-name">{{cardTitle}}</div>
      <div class="chat-item-describe">{{cardLabel}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "聊天列表卡片组件"
    };
  },
  props: {
    cardTitle: null, // 卡片标题
    cardLabel: null, // 卡片文本
    cardItem: null, // 卡片项
  },
  methods: {}
};
</script>

<style lang="stylus" scoped>
.chat-item {
  background-color: rgba(255, 255, 255, 0.9);
  height: 4rem;
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  align-items: center;
  box-shadow: 0px 1px 10px #ffd6e7;

  &-photo {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    background-color: #fff1b8;
  }

  &-label {
    padding-left: 1rem;
    text-align: left;
  }

  &-name {
    font-size: 1rem;
    font-weight: 800;
    padding: 5px 0;
  }

  &-describe {
    font-color: #8c8c8c;
    font-size: 0.5rem;
  }
}
</style>
