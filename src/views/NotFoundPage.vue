<template>
  <div class="not-found-page">
    <h1 class="title">404 - 页面未找到</h1>
    <p class="description">哎呀！您所访问的页面不存在。</p>
    <router-link to="/" class="back-link">返回首页</router-link>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.description {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.back-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}
</style>
