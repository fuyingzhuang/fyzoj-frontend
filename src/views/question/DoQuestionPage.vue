<template>
  <div id="doQuestionPage">
    <el-row>
      <el-col :span="12">
        <div class="grid-content ep-bg-purple">
          <el-card class="box-card" style="min-height: 640px">
            <template #header>
              <div class="card-header">
                <span>{{ questionDetailResponse.title }}</span>
              </div>
            </template>
            <div class="card-content">
              <div class="card-content-item">
                <div class="card-content-item">
                  <span>题目标签：</span>
                  <el-tag
                    v-for="(tag, index) in questionDetailResponse.tags"
                    :key="index"
                    >{{ tag }}
                  </el-tag>
                </div>
                <el-divider />
                <span>题目内容：</span>
                <span>
                  <ViewMarkDown
                    :value="questionDetailResponse.content"
                    :handle-change="onChange"
                /></span>
              </div>
              <el-divider />
              <div class="card-content-item">
                <span>判题要求：</span>
                <br />
                <span class="judgeConfig-item">
                  时间限制：
                  {{ questionDetailResponse.judgeConfig.timeLimit }} ms
                  <br />
                </span>
                <span class="judgeConfig-item">
                  内存限制：
                  {{ questionDetailResponse.judgeConfig.memoryLimit }} MB
                  <br />
                </span>
                <span class="judgeConfig-item">
                  堆栈限制：
                  {{ questionDetailResponse.judgeConfig.stackLimit }} MB
                  <br />
                </span>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content ep-bg-purple-light">
          <el-card class="box-card" style="min-height: 640px">
            <template #header>
              <div class="card-header">
                <span>答题</span>
              </div>
            </template>
            <!--            选择语言-->
            <el-select
              v-model="questionSubmitRequest.language"
              placeholder="请选择语言"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in languageList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-divider />
            <CodeEditor
              v-model:value="questionSubmitRequest.code"
              :handle-change="onCodeChange"
              :language="questionSubmitRequest.language"
              style="min-height: 400px"
            />
          </el-card>
          <!--          题目提交按钮-->
          <el-button
            type="primary"
            @click="submitQuestion"
            class="submitQuestion-button"
          >
            提交
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
//引入路由
import { useRouter } from "vue-router";
import {
  QuestionControllerService,
  QuestionSubmitControllerService,
} from "../../../generated";
import { ElMessage } from "element-plus";
import ViewMarkDown from "@/components/ViewMarkDown.vue";
import CodeEditor from "@/components/CodeEditor.vue";

const router = useRouter();
// 定义一个题目详情的响应对象
const questionDetailResponse = ref({
  id: "",
  title: "",
  content: "",
  tags: [],
  submitNum: 0,
  acceptedNum: 0,
  judgeConfig: {
    timeLimit: "",
    memoryLimit: "",
    stackLimit: "",
  },
  thumbNum: 0,
  favourNum: 0,
  userId: "",
  createTime: "",
  updateTime: "",
  userVO: null,
});

const onChange = (v: string) => {
  questionDetailResponse.value.content = v;
};

// 定义一个获取题目详情的方法
const getQuestionDetail = async () => {
  // 获取题目id
  const questionId = router.currentRoute.value.params.id as string;
  // 调用题目详情的接口
  const res = await QuestionControllerService.getDoQuestionInfoUsingGet(
    questionId
  );
  if (res.code === 200) {
    questionDetailResponse.value = res.data;
    //  将questionDetailResponse.tags 字符串转成json数组
    questionDetailResponse.value.tags = JSON.parse(
      questionDetailResponse.value.tags
    );
  } else {
    ElMessage({
      message: res.message,
      type: "error",
    });
  }
};
// 定义一个提供给CodeEditor组件的语言列表
const languageList = ref([
  {
    label: "cpp",
    value: "cpp",
  },
  {
    label: "go",
    value: "go",
  },
  {
    label: "java",
    value: "java",
  },
  {
    label: "python",
    value: "python",
  },
]);

// 定义一个题目提交的对象
const questionSubmitRequest = ref({
  code: "",
  language: "java",
  questionId: 0,
  status: 0,
  userId: 0,
});
//
const onCodeChange = (v: string) => {
  questionSubmitRequest.value.code = v;
};

// 定义一个提交题目的方法
const submitQuestion = async () => {
  questionSubmitRequest.value.questionId = questionDetailResponse.value.id;
  const res = await QuestionSubmitControllerService.addQuestionSubmitUsingPost(
    questionSubmitRequest.value
  );
  if (res.code === 200) {
    ElMessage({
      message: res.message,
      type: "success",
    });
  } else {
    ElMessage({
      message: res.message,
      type: "error",
    });
  }
};
onMounted(() => {
  getQuestionDetail();
});
</script>

<style scoped>
#doQuestionPage {
}

.judgeConfig-item {
  margin-left: 50px;
}

.submitQuestion-button {
  margin-left: 50%;
  margin-top: 20px;
  text-align: center;
}
</style>
