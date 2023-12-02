<template>
  <div id="userLogin">
    <el-form
      ref="ruleFormRef"
      :model="userRegisterForm"
      :rules="rules"
      label-width="120px"
      class="user-login-form"
      :size="formSize"
      status-icon
    >
      <el-form-item label="账号" prop="userAccount">
        <el-input v-model="userRegisterForm.userAccount" />
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="userRegisterForm.userName" />
      </el-form-item>
      <el-form-item label="密码" prop="userPassword">
        <el-input
          v-model="userRegisterForm.userPassword"
          type="password"
          auto-complete="off"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input
          v-model="userRegisterForm.checkPassword"
          type="password"
          auto-complete="off"
        />
      </el-form-item>
      <el-form-item label="头像" prop="avatarUrl">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8101/api/file/oss/upload"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="userRegisterForm.avatarUrl"
            :src="userRegisterForm.avatarUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          注册
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
    <!--    没有账号 立即注册？-->
    <div class="login-tip">
      <span>已有账号？</span>
      <router-link to="/user/login">立即登陆</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import type { UploadProps } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
// 使用UserLoginRequest ts对象 作为表单的数据模型
import { UserRegisterRequest } from "../../../generated/models/UserRegisterRequest";
import { UserControllerService } from "../../../generated/";
// 引入路由
import { useRouter } from "vue-router";

const router = useRouter();

// 使用UserLoginRequest ts对象 作为表单的数据模型
const userRegisterForm = ref<UserRegisterRequest>({
  checkPassword: "",
  userAccount: "",
  userPassword: "",
  avatarUrl: "",
  userName: "",
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      userRegister();
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  userRegisterForm.value.avatarUrl = URL.createObjectURL(uploadFile.raw!);
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.type !== "image/jpeg") {
    ElMessage.error("Avatar picture must be JPG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};

// 定义一个注册的方法
async function userRegister() {
  await UserControllerService.userRegisterUsingPost(
    userRegisterForm.value
  ).then((res) => {
    if (res.code === 200) {
      ElMessage.success("注册成功");
      router.push("/user/login");
    } else {
      ElMessage.error(res.message);
    }
  });
}

// 定义校验规则
const rules = ref<FormRules>({
  userAccount: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
  ],
  userPassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 50, message: "长度在不少8位", trigger: "blur" },
  ],

  userName: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
  ],

  //  判断两次密码是否一致
  checkPassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value === userRegisterForm.value.userPassword) {
          callback();
        } else {
          callback(new Error("两次输入密码不一致"));
        }
      },
      trigger: "blur",
    },
  ],
  avatarUrl: [{ required: true, message: "请上传头像", trigger: "blur" }],
});
</script>

<style scoped>
#userLogin {
  width: 100%;
  min-height: 640px;
  padding-top: 100px;
  /*  设置背景图片*/
  background-image: url("@/assets/img/back.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.user-login-form {
  width: 400px;
  margin: 0 auto;
  padding: 20px;
  /*透明*/
  opacity: 0.8;
  border-radius: 5px;
}

.login-tip {
  text-align: center;
  margin-top: 20px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
