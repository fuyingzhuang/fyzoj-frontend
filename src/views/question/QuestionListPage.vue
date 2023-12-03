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
    <el-table :data="questionListResponse" border style="width: 100%">
      <el-table-column prop="title" label="题目标题" width="180" />
      <el-table-column prop="tags" label="题目标签" width="180">
        <template #default="{ row }">
          <el-tag v-for="(tag, index) in row.tags" :key="index"
            >{{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="题目内容" width="180" />
      <!--      <el-table-column prop="judgeConfig" label="判题要求" width="180">-->
      <!--        <template #default="{ row }">-->
      <!--          <el-tag v-for="(tag, index) in row.judgeConfig" :key="index"-->
      <!--            >{{ tag }}-->
      <!--          </el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column prop="judgeCase" label="判题用例" width="180">-->
      <!--        <template #default="{ row }">-->
      <!--          <el-tag v-for="(tag, index) in row.judgeCase" :key="index"-->
      <!--            >{{ tag }}-->
      <!--          </el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column prop="answer" label="题目答案" width="540" />
      <el-table-column prop="createTime" label="创建时间" width="240" />
      <!--      操作列-->
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope.row.id)"
            >编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="deleteQuestion(scope.row.id)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    显示 questionTotal 的类型-->
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
import { ElMessage, ElMessageBox } from "element-plus";
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
  const res = await QuestionControllerService.listByAdminUsingPost(
    questionListRequest.value
  );
  if (res.code === 200) {
    questionListResponse.value = res.data.records;
    questionTotal.value = Number(res.data.total);
    //将questionTotal.value 转成number类型
    //  将questionListRequest.tags 字符串转成json数组
    // 遍历questionListResponse.value
    questionListResponse.value.forEach((item) => {
      item.tags = JSON.parse(item.tags);
      item.judgeConfig = JSON.parse(item.judgeConfig);
      item.judgeCase = JSON.parse(item.judgeCase);
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

// 删除题目的方法
const deleteQuestion = async (id: number) => {
  // 询问是否删除 当用户点击确定时，再发送请求
  ElMessageBox.confirm("此操作将永久删除该题目, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了确定");
      const res = await QuestionControllerService.deleteQuestionUsingPost({
        id: id,
      });
      if (res.code === 200) {
        ElMessage({
          message: "删除成功",
          type: "success",
        });
        getQuestionList();
      } else {
        ElMessage({
          message: res.message,
          type: "error",
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除",
      });
    });
};

// 编辑题目的方法
const handleEdit = (id: number) => {
  // 跳转到编辑页面
  router.push({
    path: "/question/edit/" + id,
  });
};
// 定义一个搜索题目的方法
const searchQuestion = () => {
  console.log(questionListRequest.value.tagsStr);
  questionListRequest.value.tags = questionListRequest.value.tagsStr.split(",");
  getQuestionList();
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
</style>
