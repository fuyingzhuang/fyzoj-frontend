<template>
  <div class="common-layout" id="common-layout">
    <el-container>
      <el-header>
        <UserLayoutHeader />
      </el-header>
      <el-main class="content">
        <router-view />
      </el-main>
      <el-footer>
        <GlobalFooter />
      </el-footer>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import GlobalFooter from "@/components/GlobalFooter.vue";
import UserLayoutHeader from "@/components/UserLayoutHeader.vue";
</script>

<style scoped>
#common-layout {
  height: 100%;
}

.content {
  background-color: #e9eef3;
  margin-top: 20px;
  min-height: 80vh;
}
</style>
