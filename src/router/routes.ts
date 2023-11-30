import { RouteRecordRaw } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import IndexPage from "@/views/IndexPage.vue";
import AdminPage from "@/views/AdminPage.vue";
import UserRegisterPage from "@/views/user/UserRegisterPage.vue";
import UserLoginPage from "@/views/user/UserLoginPage.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import { AccessEnum } from "@/access/accessEnum";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户模块",
    component: UserLayout,
    children: [
      {
        path: "/user/register",
        name: "用户注册",
        component: UserRegisterPage,
      },
      {
        path: "/user/login",
        name: "用户注册",
        component: UserLoginPage,
      },
    ],
  },
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
