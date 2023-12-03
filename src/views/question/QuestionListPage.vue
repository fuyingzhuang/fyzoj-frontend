<template>
  <div id="questionListPage">
    <el-table :data="questionListResponse" border style="width: 100%">
      <el-table-column prop="title" label="题目标题" width="180" />
      <el-table-column prop="tags" label="题目标签" width="180" />
      <el-table-column prop="content" label="题目内容" width="180" />
      <el-table-column prop="judgeConfig" label="判题要求" width="180" />
      <el-table-column prop="judgeCase" label="判题用例" width="180" />
      <el-table-column prop="answer" label="题目答案" width="180" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <!--      操作列-->
      <el-table-column fixed="right" label="Operations">
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
  pageSize: 0,
  sortField: "",
  sortOrder: "",
  tags: [],
  title: "",
});

// 定义一个题目列表的响应对象
const questionListResponse = ref([]);
// 定义一个总数
const total = ref(0);
// 定义一个请求题目列表的方法

const getQuestionList = async () => {
  const res = await QuestionControllerService.listByAdminUsingPost(
    questionListRequest.value
  );
  if (res.code === 200) {
    questionListResponse.value = res.data.records;
    total.value = res.data.total;
  } else {
    ElMessage({
      message: res.message,
      type: "error",
    });
  }
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
// 页面加载完成后，请求题目列表
onMounted(() => {
  getQuestionList();
});
</script>

<style scoped>
#questionListPage {
}
</style>
