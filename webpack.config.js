const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./client/index.tsx",
  output: {
    path: path.resolve(__dirname, "build", "public"),
    filename: "bundle.js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|ttf)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./client/public/index.html",
    }),
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true,
    proxy: {
      "/api/**": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/static/**": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
};
