// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require("@vue/cli-service");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack(config: any) {
    config.plugin("monaco").use(new MonacoWebpackPlugin());
  },

  server: {
    //配置 上传图片的代理
    proxy: {
      "/upload/image": {
        target: `http://localhost:8101/api/file/oss/upload`,
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
    },
  },
});
