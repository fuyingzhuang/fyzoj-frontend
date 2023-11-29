import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import BaseLayout from "../layouts/BaseLayout.vue";
import routes from "@/router/routes";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
