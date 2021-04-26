const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin")
module.exports = {
  plugins: [
    new MonacoWebpackPlugin({
      languages: ["cpp", "csharp", "typescript", "rust","json"],
    }),
  ],
}
