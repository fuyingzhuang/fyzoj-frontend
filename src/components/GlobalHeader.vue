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
      <el-menu-item
        v-for="item in visibleRoutes"
        :index="item.path"
        :key="item.path"
        >{{ item.name }}
      </el-menu-item>
    </el-menu>
    <div class="login-user">
      <!--     <img style="width: 80px; height: 60px" :src="logoImg" alt="logo" />-->
      <span style="align-content: center"
        >当前用户: {{ store.state.user?.loginUser?.userName ?? "未登录" }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import routes from "../router/routes";
import logoImg from "../assets/img/logo.png";
import checkAccess from "../access/checkAccess";
import { useStore } from "vuex";
import { AccessEnum } from "@/access/accessEnum";
// 引入route
const store = useStore();
// 引入路由
import { useRouter } from "vue-router";
import { UserControllerService } from "../../generated";

const router = useRouter();
const activeIndex = ref("1");

// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

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
