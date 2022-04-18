const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
	transpileDependencies: true,
	devServer: {
		allowedHosts: "all",
	},
	configureWebpack: {
		plugins: [new NodePolyfillPlugin()],
		optimization: {
			splitChunks: {
				chunks: "all",
			},
		},
	},
})
// vim: set sw=4 ts=4 indk= list noet:
