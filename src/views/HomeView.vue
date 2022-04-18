<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/logo.png">
		<HelloWorld :msg="hello_msg"/>
		<button @click="sign_in">Sign in</button>
		<button @click="sign_out">Sign out</button>
	</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue"
import { sign_in_with_google, sign_out } from "@/auth";

export default {
	name: "HomeView",
	components: {
		HelloWorld
	},
	data() {
		return {
		};
	},
	computed: {
		hello_msg() {
			return `Welcome to Your Vue.js App, ${this.$store.state.user.displayName}`;
		},
	},
	methods: {
		sign_in() {
			sign_in_with_google().then(() => {
				this.$store.commit("notify", "signinout", "info", `Successfully signed in as ${this.$store.state.user.email}`);
				alert(`Successfully signed in as ${this.$store.state.user.email}`);
				this.$router.push("/about");
			});
		},
		sign_out() {
			sign_out().then(() => {
				this.$store.commit("notify", "signinout", "error", "Successfully signed out");
				alert("Successfully signed out");
			});
		},
	},
}
</script>
<!-- vim: set sw=4 ts=4 noet list: -->
