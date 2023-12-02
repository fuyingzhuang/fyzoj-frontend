<template>
  <div id="indexPage">
    <CodeEditor
      :value="value"
      :handle-change="onChange"
      style="min-height: 400px"
    />
  </div>
</template>

<script setup lang="ts">
import CodeEditor from "@/components/CodeEditor.vue";
import { ref } from "vue";

const value = ref("");

const onChange = (v: string) => {
  value.value = v;
};
</script>

<style scoped></style>
