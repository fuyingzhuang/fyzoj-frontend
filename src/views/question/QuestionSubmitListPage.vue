<template>
  <div id="questionSubmitListPage">
    <!--    搜索表单-->
    <el-form
      :inline="true"
      :model="questionSubmitListQuery"
      class="question-submit-search"
    >
      <el-form-item label="题目题号">
        <el-input
          v-model="questionSubmitListQuery.questionId"
          placeholder="请输入题目题号"
        />
      </el-form-item>
      <el-form-item label="编程语言">
        <el-select
          v-model="questionSubmitListQuery.language"
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
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="searchQuestion">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="questionSubmitListData"
      border
      style="width: 100%"
      class="question-page-table"
    >
      <el-table-column prop="id" label="提交号" width="180" />
      <el-table-column prop="questionId" label="题目题号" width="180" />
      <el-table-column prop="language" label="题目语言" width="180" />
      <el-table-column props="judgeInfo" label="判题信息" width="180" />
      <el-table-column props="status" label="判题状态" width="180" />
      <el-table-column prop="userId" label="提交者id" width="180" />
      <el-table-column prop="createTime" label="创建时间" />
    </el-table>
    <!--    显示 questionTotal 的类型-->
    <!--    分页组件-->
    <div style="min-height: 100px; margin-right: 50%; margin-top: 32px">
      <el-pagination
        class="page"
        background
        layout="prev, pager, next"
        :total="questionSubmitTotal"
        :current-page="questionSubmitListQuery.current"
        :page-size="questionSubmitListQuery.size"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { QuestionSubmitControllerService } from "../../../generated";
import { ElMessage } from "element-plus";
import moment from "moment";
// 定义一个题目提交列表的查询对象参赛
const questionSubmitListQuery = ref({
  code: "",
  current: 1,
  size: 10,
  judgeInfo: "",
  language: "",
  questionId: 0,
  sortField: "",
  sortOrder: "",
  status: 0,
  userId: 0,
});
// 定义一个题目提交列表的数据
const questionSubmitListData = ref([]);

const questionSubmitTotal = ref(0);
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

//
const searchQuestion = async () => {
  console.log(questionSubmitListQuery.value);
  const res = await QuestionSubmitControllerService.listQuestionSubmitUsingPost(
    questionSubmitListQuery.value
  );
  if (res.code === 200) {
    questionSubmitListData.value = res.data.records;
    questionSubmitTotal.value = Number(res.data.total);
    questionSubmitListData.value.forEach((item: any) => {
      //  将createTime用moment格式化
      item.createTime = moment(item.createTime).format("YYYY-MM-DD HH:mm:ss");
    });
  } else {
    ElMessage.error(res.message);
    console.log(res);
  }
};

function handleCurrentChange(val: number) {
  questionSubmitListQuery.value.current = val;
  searchQuestion();
}

function handleSizeChange(val: number) {
  questionSubmitListQuery.value.size = val;
  searchQuestion();
}

searchQuestion();
</script>

<style scoped>
#questionSubmitListPage {
}

.question-submit-search {
  margin-bottom: 20px;
  margin-left: 20%;
}
</style>
