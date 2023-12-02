<template>
  <div id="homePage">
    <MarkDown :value="value" :handle-change="onChange" />
    <CodeEditor v-model:value="value" style="min-height: 400px" />
  </div>
</template>

<script setup lang="ts">
import MarkDown from "@/components/MarkDown.vue";
import { ref } from "vue";

const value = ref("");

const onChange = (v: string) => {
  value.value = v;
};
</script>

<style scoped></style>
