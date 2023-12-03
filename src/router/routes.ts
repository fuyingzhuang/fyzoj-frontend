import { RouteRecordRaw } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import IndexPage from "@/views/IndexPage.vue";
import AdminPage from "@/views/AdminPage.vue";
import UserRegisterPage from "@/views/user/UserRegisterPage.vue";
import UserLoginPage from "@/views/user/UserLoginPage.vue";
import AddQuestionPage from "@/views/question/AddQuestionPage.vue";
import EditQuestionPage from "@/views/question/EditQuestionPage.vue";
import QuestionListPage from "@/views/question/QuestionListPage.vue";
import QuestionBrowsePage from "@/views/question/QuestionBrowsePage.vue";
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
        name: "用户登录",
        component: UserLoginPage,
      },
    ],
    //  隐藏
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/home",
    name: "题目模块",
    component: HomePage,
  },
  {
    path: "/",
    name: "首页",
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
  {
    path: "/question/add",
    name: "添加题目",
    component: AddQuestionPage,
    meta: {
      access: AccessEnum.USER,
    },
  },
  {
    path: "/question/browse",
    name: "浏览题目",
    component: QuestionBrowsePage,
    meta: {
      access: AccessEnum.USER,
    },
  },
  {
    path: "/question/edit/:id",
    name: "编辑题目",
    component: EditQuestionPage,
    meta: {
      access: AccessEnum.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/question/list",
    name: "题目列表",
    component: QuestionListPage,
    meta: {
      access: AccessEnum.USER,
    },
  },
  //  404 页面
  {
    path: "/:pathMatch(.*)*",
    name: "404页面",
    component: () => import("@/views/NotFoundPage.vue"),
    //  隐藏
    meta: {
      hideInMenu: true,
    },
  },
];
export default routes;
