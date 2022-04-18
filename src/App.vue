<template>
	<nav>
		<router-link to="/">Home</router-link> |
		<router-link to="/about">About</router-link>
	</nav>
	<router-view/>
	<!--v-overlay :value="Object.keys($store.state.notifications).length > 0" class="alerts">
		<v-alert class="ma-2" border="left" dismissible
			v-for="(a, id) in $store.state.notifications" :key="id"
			:type="a.type" @input="v => v || $store.commit('notify', id)" z-index="9999"
		>
			{{ a.message }}
		</v-alert>
	</v-overlay-->
</template>

<style>
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
