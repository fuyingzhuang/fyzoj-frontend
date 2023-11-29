import { RouteRecordRaw } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import IndexPage from "@/views/IndexPage.vue";
import AdminPage from "@/views/AdminPage.vue";
import { AccessEnum } from "@/access/accessEnum";
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
  {
    path: "/admin",
    name: "管理员页面",
    component: AdminPage,
    meta: {
      access: AccessEnum.USER,
    },
  },
];
export default routes;
