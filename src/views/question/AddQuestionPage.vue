<template>
  <div id="addQuestionPage">
    <el-form
      ref="ruleFormRef"
      :model="questionInfo"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="题目标题" prop="title">
        <el-input v-model="questionInfo.title" />
      </el-form-item>

      <el-form-item label="题目标签" prop="tags">
        <el-tag
          v-for="tag in questionInfo.tags"
          :key="tag"
          class="mx-1"
          style="margin-left: 16px"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          style="margin-top: 16px"
          ref="InputRef"
          v-model="inputValue"
          class="ml-1 w-20"
          size="small"
          @blur="handleInputConfirm"
        />
        <el-button
          v-else
          style="margin-left: 16px"
          class="button-new-tag ml-1"
          size="small"
          @click="showInput"
        >
          + New Tag
        </el-button>
      </el-form-item>
      <el-form-item label="题目内容" prop="content" style="min-height: 400px">
        <MarkDown
          style="min-width: 640px"
          :value="questionInfo.content"
          :handle-change="contentOnChange"
        />
      </el-form-item>

      <el-form-item label="题目答案" prop="content" style="min-height: 400px">
        <MarkDown
          style="min-width: 640px"
          :value="questionInfo.answer"
          :handle-change="answerOnChange"
        />
      </el-form-item>
      <el-form-item label="判题配置" prop="judgeConfig" class="config-item">
        <el-form-item label="时间限制" prop="timeLimit" class="sub-item">
          <el-input-number
            v-model="questionInfo.judgeConfig.timeLimit"
            :min="0"
            :max="100000"
            :step="100"
          />
          <span style="margin-left: 16px">MS</span>
        </el-form-item>
        <el-form-item label="内存限制" prop="memoryLimit" class="sub-item">
          <el-input-number
            v-model="questionInfo.judgeConfig.memoryLimit"
            :min="0"
            :max="100000"
            :step="100"
            controls
          />
          <span style="margin-left: 16px">MB</span>
        </el-form-item>

        <el-form-item label="堆栈限制" prop="stackLimit" class="sub-item">
          <el-input-number
            v-model="questionInfo.judgeConfig.stackLimit"
            :min="0"
            :max="100000"
            :step="100"
          />
          <span style="margin-left: 16px">MB</span>
        </el-form-item>
      </el-form-item>

      <!--      动态表单-->
      <el-form-item label="判题用例" prop="judgeCase" class="config-item">
        <el-form-item
          v-for="(item, index) in questionInfo.judgeCase"
          :key="index"
          :label="'判题用例' + (index + 1)"
          class="sub-item"
        >
          <el-form-item label="输入" prop="input">
            <el-input
              v-model="item.input"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
            />
          </el-form-item>
          <el-form-item label="输出" prop="output">
            <el-input
              v-model="item.output"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              style="margin-left: 16px"
              type="danger"
              @click="deleteJudgeCase(index)"
              >删除
            </el-button>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addJudgeCase">
            添加判题用例
          </el-button>
        </el-form-item>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          创建
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import { ElInput, ElMessage } from "element-plus";
// 引入路由
import { useRouter } from "vue-router";

const router = useRouter();
const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
import type { FormInstance, FormRules } from "element-plus";
import {
  QuestionAddRequest,
  QuestionControllerService,
} from "../../../generated";
// 定义一个添加题目的对象
const questionInfo = ref({
  title: "",
  tags: [],
  content: "",
  answer: "",
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
  userId: 0,
} as QuestionAddRequest);

// 动态添加标签
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();
const inputValue = ref("");
// 关闭标签
const handleClose = (tag: string) => {
  //  遍历标签数组
  const tags = questionInfo.value.tags.filter((item) => item !== tag);
  questionInfo.value.tags = tags;
};

// 显示输入框
const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value?.focus();
  });
};

const handleInputConfirm = () => {
  // 如果输入框为空 则不添加
  if (inputValue.value.length === 0) {
    inputVisible.value = false;
    return;
  }
  // 判断是否已经存在
  if (questionInfo.value.tags.indexOf(inputValue.value) !== -1) {
    ElMessage({
      message: "标签已经存在",
      type: "warning",
    });
    inputVisible.value = false;
    return;
  }
  questionInfo.value.tags.push(inputValue.value);
  //  添加完成之后 清空输入框
  inputValue.value = "";
  inputVisible.value = false;
};

// 题目内容 改变
import MarkDown from "@/components/MarkDown.vue";

const contentOnChange = (v: string) => {
  questionInfo.value.content = v;
};

// 题目答案 改变
const answerOnChange = (v: string) => {
  questionInfo.value.answer = v;
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      addQuestion();
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 删除判题用例
const deleteJudgeCase = (index: number) => {
  questionInfo.value.judgeCase.splice(index, 1);
};
// 添加判题用例
const addJudgeCase = () => {
  questionInfo.value.judgeCase.push({
    input: "",
    output: "",
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

// 定义一个添加题目的方法
async function addQuestion() {
  const res = await QuestionControllerService.addQuestionUsingPost(
    questionInfo.value
  );
  if (res.code === 200) {
    ElMessage({
      message: "添加成功",
      type: "success",
    });
    //  重置表单
    resetForm(ruleFormRef.value);
    //  跳转到题目列表
    router.push("/question/list");
  } else {
    ElMessage({
      message: res.message,
      type: "error",
    });
  }
}

// 定义一个表单的校验规则
const rules = ref<FormRules>({
  // 题目标题 在3-2000个字符之间
  title: [
    { required: true, message: "请输入题目标题", trigger: "blur" },
    { min: 3, max: 2000, message: "长度在 3 到 2000 个字符", trigger: "blur" },
  ],
  // tags 标签 不能少于1个
  tags: [{ required: true, message: "请至少添加一个标签", trigger: "blur" }],
  // 题目内容 "长度在 3 到 2000 个字符
  content: [
    { required: true, message: "请输入题目内容", trigger: "blur" },
    { min: 3, max: 2000, message: "长度在 3 到 2000 个字符", trigger: "blur" },
  ],
  // 题目答案 "长度在 3 到 2000 个字符
  answer: [
    { required: true, message: "请输入题目答案", trigger: "blur" },
    { min: 3, max: 2000, message: "长度在 3 到 2000 个字符", trigger: "blur" },
  ],
  // 判题配置
  judgeConfig: [
    { required: true, message: "请输入判题配置", trigger: "blur" },
    { type: "object", message: "必须为对象", trigger: "blur" },
  ],
  // timeLimit: [{ required: true, message: "时间限制不能为空", trigger: "blur" }],
  // memoryLimit: [
  //   { required: true, message: "内存限制不能为空", trigger: "blur" },
  // ],
  // stackLimit: [
  //   { required: true, message: "堆栈限制不能为空", trigger: "blur" },
  // ],

  // 判题用例
  judgeCase: [
    { required: true, message: "请输入判题用例", trigger: "blur" },
    { type: "array", message: "必须为数组", trigger: "blur" },
  ],
  // input: [{ required: true, message: "输入不能为空", trigger: "blur" }],
  // output: [{ required: true, message: "输出不能为空", trigger: "blur" }],
});
</script>

<style scoped>
#addQuestionPage {
}

.config-item {
  display: flex;
  flex-wrap: wrap;
}

.sub-item {
  flex-basis: 100%;
  margin-top: 16px;
}
</style>
