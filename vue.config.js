const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const config = require("./src/config.js");

module.exports = defineConfig({
	transpileDependencies: true,
	devServer: {
		allowedHosts: "all",
		client: {
			webSocketURL: config.backend.baseURL.replace(/https:(.*)/, "wss:$1/ws"),
		},
	},
	configureWebpack: {
		plugins: [new NodePolyfillPlugin()],
		optimization: {
			splitChunks: {
				chunks: "all",
			},
		},
	},
	pages: {
		index: {
			entry: "src/main.js",
			title: "Your Application",
		},
	},
})
// vim: set sw=4 ts=4 indk= list noet:
