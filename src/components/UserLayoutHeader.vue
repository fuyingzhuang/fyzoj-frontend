<template>
  <div id="userGlobalHeader" class="no-auth-header">
    <img style="width: 160px; height: 60px" :src="logoImg" alt="logo" />
    <span class="title">Ambition OJ</span>
  </div>
</template>

<script setup lang="ts">
import logoImg from "../assets/img/logo.png";
</script>

<style scoped>
.title {
  font-weight: bold;
  margin-left: 20px;
  font-size: 20px;
  margin-top: 10px;
  margin-right: 20px;
}

.no-auth-header {
  display: flex;
  height: 60px;
}
</style>
