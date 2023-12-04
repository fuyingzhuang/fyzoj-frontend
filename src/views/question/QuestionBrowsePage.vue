<template>
  <div id="questionListPage">
    <!--    搜索表单-->
    <el-form
      :inline="true"
      :model="questionListRequest"
      class="question-search"
    >
      <el-form-item label="题目标题">
        <el-input
          v-model="questionListRequest.title"
          placeholder="请输入题目标题"
        />
      </el-form-item>
      <el-form-item label="题目内容">
        <el-input
          v-model="questionListRequest.content"
          placeholder="请输入题目内容"
        />
      </el-form-item>
      <el-form-item label="题目标签">
        <el-input
          v-model="questionListRequest.tagsStr"
          placeholder="标签(多个用,隔开)"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchQuestion">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="questionListResponse"
      :row-class-name="tableRowClassName"
      border
      class="user-browse-table"
    >
      <!--      序号-->
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="title" label="题目标题" width="240" />
      <el-table-column prop="tags" label="题目标签" width="240">
        <template #default="{ row }">
          <el-tag v-for="(tag, index) in row.tags" :key="index"
            >{{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <!--      通过数量-->
      <el-table-column prop="passRate" label="通过数量" width="180">
        <template #default="{ row }">
          {{ row.acceptedNum }} / {{ row.submitNum }}
        </template>
      </el-table-column>

      <!--      通过率-->
      <el-table-column prop="passRate" label="通过率" width="180">
        <template #default="{ row }">
          <el-progress
            :text-inside="true"
            :stroke-width="18"
            :percentage="
              row.submitNum !== 0 ? (row.acceptedNum / row.submitNum) * 100 : 0
            "
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="240" />
      <!--      操作列-->
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="toDoQuestion(scope.row.id)"
            >答题
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页组件-->
    <div style="min-height: 100px">
      <el-pagination
        class="page"
        background
        layout="prev, pager, next"
        :total="questionTotal"
        :current-page="questionListRequest.current"
        :page-size="questionListRequest.pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { QuestionControllerService } from "../../../generated";
import { ElMessage } from "element-plus";
// 引入路由
import { useRouter } from "vue-router";
// 定义一个路由对象
const router = useRouter();
// 定义一个请求题目列表的请求参数对象
const questionListRequest = ref({
  content: "",
  current: 1,
  pageSize: 10,
  tags: [],
  tagsStr: "",
  title: "",
});
import moment from "moment";
// 定义一个题目列表的响应对象
const questionListResponse = ref([]);
// 定义一个总数
const questionTotal = ref(0);
// 定义一个请求题目列表的方法

const getQuestionList = async () => {
  const res = await QuestionControllerService.listByUserUsingPost(
    questionListRequest.value
  );
  if (res.code === 200) {
    questionListResponse.value = res.data.records;
    questionTotal.value = Number(res.data.total);
    //将questionTotal.value 转成number类型
    //  将questionListRequest.tags 字符串转成json数组
    // 遍历questionListResponse.value
    questionListResponse.value.forEach((item) => {
      // item.tags = JSON.parse(item.tags);
      //  将createTime用moment格式化
      item.createTime = moment(item.createTime).format("YYYY-MM-DD ");
    });
  } else {
    ElMessage({
      message: res.message,
      type: "error",
    });
  }
};

// 定义一个分页的方法
const handleCurrentChange = (val: number) => {
  questionListRequest.value.current = val;
  getQuestionList();
};
// 定义一个分页的方法
const handleSizeChange = (val: number) => {
  questionListRequest.value.pageSize = val;
  getQuestionList();
};

// 去答题
const toDoQuestion = (id: number) => {
  // 跳转到答题页面
  router.push({
    path: "/do/question/" + id,
  });
};
// 定义一个搜索题目的方法
const searchQuestion = () => {
  console.log(questionListRequest.value.tagsStr);
  questionListRequest.value.tags = questionListRequest.value.tagsStr.split(",");
  getQuestionList();
};

const tableRowClassName = ({ row, rowIndex }) => {
  // 如果通过率小于20% 就显示红色
  if (row.submitNum !== 0 && (row.acceptedNum / row.submitNum) * 100 < 20) {
    return "warning-row";
  }
  // 如果通过率大于80% 就显示绿色
  if (row.submitNum !== 0 && (row.acceptedNum / row.submitNum) * 100 > 80) {
    return "success-row";
  }
  // 如果通过率在20%~80% 就显示黄色
  if (
    row.submitNum !== 0 &&
    (row.acceptedNum / row.submitNum) * 100 >= 20 &&
    (row.acceptedNum / row.submitNum) * 100 <= 80
  ) {
    return "danger-row";
  }
  // 如果通submitNum 就显示灰色
  if (row.submitNum === 0) {
    return "info-row";
  }
};

// 页面加载完成后，请求题目列表
onMounted(() => {
  // 将questionListRequest.tags转换成数组 用,分割
  getQuestionList();
});
</script>

<style scoped>
#questionListPage {
}

.question-search {
  margin-bottom: 20px;
  text-align: center;
}

.page {
  margin-left: 50%;
  margin-top: 20px;
}

.user-browse-table {
  margin: 0 auto;
  max-width: 1280px;
}

.el-table .warning-row {
  background-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
  background-color: var(--el-color-success-light-9);
}

.el-table .danger-row {
  background-color: var(--el-color-danger-light-9);
}

.el-table .info-row {
  background-color: var(--el-color-info-light-9);
}
</style>
