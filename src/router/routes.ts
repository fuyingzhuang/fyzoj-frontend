import { RouteRecordRaw } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import IndexPage from "@/views/IndexPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/home",
    name: "题目模块",
    component: HomePage,
  },
  {
    path: "/",
    name: "题目列表",
    component: IndexPage,
  },
];
export default routes;
