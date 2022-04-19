<template>
<div :style="cssVars">

	<Toast position="top-right"/>
	<nav>
		<router-link to="/">Home</router-link> |
		<router-link to="/about">About</router-link>
	</nav>
	<router-view/>

</div>
</template>

<script>

export default {
	name: "App",
	components: {
	},
	data() {
		return {
		};
	},
	computed: {
		cssVars: function () {
			// https://www.telerik.com/blogs/passing-variables-to-css-on-a-vue-component
			return {
				"--some-other-var": "42,
			};
		},
	},
	mounted() {
		this.$store.commit("setToastService", this.$toast);
		this.$store.commit("setInfo", "Welcome");
	},
};
</script>

<style>
:root {
	--some-variable: 3.5rem;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

nav {
	padding: 30px;
}

nav a {
	font-weight: bold;
	color: #2c3e50;
}

nav a.router-link-exact-active {
	color: #42b983;
}

</style>

<!--style lang="scss" scoped>
	.alerts .v-overlay__content {
		display: flex;
		flex-direction: column-reverse;
	}
</style-->

// vim: set sw=4 ts=4 noet list:
