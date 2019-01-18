<template>
  <div class="chat-list">
    <div class="chat-list-head">BLing BLing</div>
    <div class="chat-list-content">
      <div
        class="chat-list-content-items"
        v-for="item in list"
        :key="item.id"
        v-on:click="goChat(item)"
      >
        <chat-item :cardTitle="item.name" :cardLabel="item.label" :action="item.action"></chat-item>
      </div>
    </div>
  </div>
</template>

<script>
import ChatItem from "@/components/Chat/ChatItem";

export default {
  name: "chatList",
  components: { ChatItem },
  computed: {},
  data() {
    return {
      name: "列表",
      list: [], // 用户列表
      action: [] // 单个老师的行为
    };
  },
  created() {
    this.getChatList();
  },
  methods: {
    // 获取聊天列表
    getChatList() {
      this.$http
        .get("/static/db/userList.json")
        .then(({ body }) => {
          const { teacher } = body;
          this.list = teacher;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 去和某位老师聊天
    goChat(item) {
      const { api } = item;
      this.$router.push(`/chat-window?api=${api}`);
    }
  }
};
</script>

<style lang="stylus" scoped>
.chat-list {
  background: #f9f0ff;

  &-head {
    height: 5rem;
    font-size: 1.5rem;
    line-height: 5rem;
    background: linear-gradient(90deg, #ff85c0, #d3adf7);
    color: #fff;
    font-family: Helvetica;
    box-shadow: 2px 2px 23px #aaaaaa;
    z-index: 10;
    position: absolute;
    width: 100%;
    box-shadow: 0 2px 5px #ffadd2;
  }

  &-content {
    position: absolute;
    top: 5rem;
    bottom: 0;
    width: 100%;
    background-color: #fff1f0;
    padding: 1rem 0;

    &-items {
      padding: 1rem;
    }
  }
}
</style>
