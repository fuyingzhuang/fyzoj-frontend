<template>
  <div id="userLogin">
    <el-form
      ref="ruleFormRef"
      :model="userLoginForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="用户名" prop="userAccount">
        <el-input v-model="userLoginForm.userAccount" />
      </el-form-item>
      <el-form-item label="密码" prop="userPassword">
        <el-input
          v-model="userLoginForm.userPassword"
          type="password"
          auto-complete="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          登录
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";

const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
// 使用UserLoginRequest ts对象 作为表单的数据模型
import { UserLoginRequest } from "../../../generated/models/UserLoginRequest";
import { UserControllerService } from "../../../generated/";
// 引入路由
import { useRouter } from "vue-router";

const router = useRouter();
// 引入store
import { useStore } from "vuex";

const store = useStore();

// 使用UserLoginRequest ts对象 作为表单的数据模型
const userLoginForm = ref<UserLoginRequest>({
  userAccount: "",
  userPassword: "",
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      userLogin();
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

// 定义一个登陆的方法
const userLogin = async () => {
  // 调用登陆的接口
  const res = await UserControllerService.userLoginUsingPost(
    userLoginForm.value
  );
  //  如果登陆成功，跳转到首页
  if (res.code === 200) {
    // 修改store中的用户信息
    await store.dispatch("user/getLoginUser");
    // 跳转到首页
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    // 如果登陆失败，提示用户
    ElMessage.error(res.message);
  }
};

// 定义校验规则
const rules = ref<FormRules>({
  userAccount: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
  ],
  userPassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 50, message: "长度在不少8位", trigger: "blur" },
  ],
});
</script>

<style scoped></style>
