<template>
  <div class="common-layout" id="common-layout">
    <el-container>
      <el-header>
        <GlobalHeader />
      </el-header>
      <el-main class="content">
        <router-view />
      </el-main>
      <el-footer class="footer">Footer</el-footer>
    </el-container>
  </div>
</template>
<script lang="ts" setup></script>

<style scoped>
#common-layout {
  height: 100%;
}

.content {
  background-color: #e9eef3;
  margin-top: 20px;
}

.footer {
  background-color: #efefef;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80px;
  text-align: center;
}
</style>
<script>
import GlobalHeader from "@/components/GlobalHeader";

export default {
  components: { GlobalHeader },
};
</script>
