<template>
  <div id="globalHeader" class="header">
    <img style="width: 160px; height: 60px" :src="logoImg" alt="logo" />
    <span class="title">Ambition OJ</span>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
    >
      <div class="flex-grow" />
      <el-menu-item v-for="item in routes" :index="item.path" :key="item.path"
        >{{ item.name }}
      </el-menu-item>
    </el-menu>
    <div class="login-user">
      <!--     <img style="width: 80px; height: 60px" :src="logoImg" alt="logo" />-->
      <span style="align-content: center">当前用户:&nbsp;&nbsp;Ambition</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import routes from "../router/routes";
import logoImg from "../assets/img/logo.png";

// 引入路由
import { useRouter } from "vue-router";

const router = useRouter();
// 引入route
import { useRoute } from "vue-router";

const route = useRoute();
const activeIndex = ref("1");

// 监听路由变化
router.afterEach((to, from) => {
  activeIndex.value = to.path;
});
const handleSelect = (key: string, keyPath: string[]) => {
  router.push(key);
};
</script>

<style scoped>
.title {
  font-weight: bold;
  margin-left: 20px;
  font-size: 20px;
  margin-top: 10px;
  margin-right: 20px;
}

.header {
  display: flex;
  height: 60px;
}

.login-user {
  /*定位在屏幕最右边*/
  position: absolute;
  right: 20px;
  margin-top: 10px;
}
</style>
