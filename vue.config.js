const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  server: {
    //配置 上传图片的代理
    proxy: {
      "/upload/image": {
        target: `http://localhost:8101/api/file/oss/upload`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
