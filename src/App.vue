<template>
<div :style="cssVars">

<div class="topbar">
	<i class="menu-switch pi pi-chevron-circle-down" @click="sidebarVisible = !sidebarVisible"/>
	<div class="topbar-content">
		<h3>{{ $store.state.appBarInfo }}</h3>
	</div>
	<Avatar v-if="$store.getters.isLoggedIn" :image="$store.state.user.photoURL" size="large" @click="toggleAccountMenu"/>
	<Avatar v-else icon="mdi mdi-login" size="large" @click="signIn"/>
	<Menu ref="accountMenu" :model="accountMenu" :popup="true"/>
</div>

<div class="menu">
	<div v-for="(m, idx) in menu" :key="idx" :class="m.iconClass ? 'menu-item' : 'menu-spacer'">
		<router-link v-if="m.to" :to="m.to"><i :class="m.iconClass" @click="yadda"/></router-link>
		<router-link v-if="m.to" :to="m.to"><h4 v-show="sidebarVisible">{{ m.text }}</h4></router-link>
	</div>
</div>

<Toast class="toast-over-main" position="top-right"/>

<div class="main">
	<router-view/>
</div>

</div>
</template>

<script>
import { signInWithGoogle, signOut } from "@/auth";

export default {
	name: "App",
	components: {
	},
	data() {
		return {
			sidebarVisible: false,
			menu: [
				{ iconClass: "pi pi-chart-line", text: "Page One", to: "/page-one" },
				{ iconClass: "pi pi-chart-bar", text: "Page Two", to: "/" },
				{ iconClass: "pi pi-calendar", text: "Page Three", to: "/" },
				{},
				{ iconClass: "pi pi-info", text: "About", to: "/" },
			],
			accountMenu: [
				{
					label: "Sign Out",
					icon: "mdi mdi-logout",
					command: this.signOut,
				},
			],
		};
	},
	computed: {
		cssVars: function () {
			// https://www.telerik.com/blogs/passing-variables-to-css-on-a-vue-component
			return {
				"--menu-width": this.sidebarVisible ? "20rem" : "4rem",
				"--menu-switch-transform": this.sidebarVisible ? "rotate(90deg)" : "",
			};
		},
	},
	methods: {
		toggleAccountMenu(event) {
			this.$refs.accountMenu.toggle(event);
		},
		signIn() {
			return signInWithGoogle().then(() => {
				const msg = `Successfully signed in as ${this.$store.state.user.email}`;
				this.$toast.add({severity: "success", summary: msg, life: 3000,});
				this.$router.push("/");
			});
		},
		signOut() {
			return signOut().then(() => {
				const msg = "Successfully signed out";
				this.$toast.add({severity: "warn", summary: msg, life: 3000,});
				this.$router.push("/");
			});
		},
		yadda() {
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
	--topbar-height: 3.5rem;
	--menu-item-height: 4rem;
	--menu-width-min: 3rem;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

div.topbar {
	z-index: 9999;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: var(--topbar-height);

	display: flex;
	flex-direction: row;

	background: var(--surface-100);
	color: var(--text-color);
	border-bottom: 2px solid var(--primary-color-text);
}

div.topbar i {
	font-size: 2rem !important;
	flex-grow: 0;
}

div.topbar div.p-avatar {
	flex-grow: 0;
}

div.topbar * {
	margin: auto 0.5rem;
}

div.topbar-content {
	flex-grow: 1;
}

i.menu-switch {
	transform: var(--menu-switch-transform);
	transition-duration: 0.3s;
	width: var(--menu-width-min);
}

div.menu {
	z-index: 9998;
	position: fixed;
	left: 0;
	top: var(--topbar-height);
	bottom: 0;
	width: var(--menu-width);
	transition-duration: 0.3s;

	display: flex;
	flex-direction: column;

	background: var(--surface-200);
	color: var(--text-color);

	text-align: left;
	padding: 0px 0.5rem;
}

div.menu-spacer {
	flex-grow: 1;
}

div.menu-item {
	flex-grow: 0;
	display: flex;
	flex-direction: row;
	height: var(--menu-item-height);
	margin: 0 0.5rem;
	align-items: center;
	border-bottom: 2px solid var(--primary-color-text);
}

div.menu-item i {
	font-size: 2rem !important;
	width: var(--menu-width-min);
}

div.menu-item a {
	text-decoration: none;
}

.toast-over-main {
	top: var(--topbar-height);
}

div.main {
	padding-top: var(--topbar-height);
	padding-left: var(--menu-width);
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
<!-- vim: set sw=4 ts=4 noet list: -->
