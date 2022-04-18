<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/logo.png">
		<HelloWorld :msg="helloMsg"/>
		<pv-button v-if="$store.getters.isLoggedIn" class="p-button-warning" icon="mdi mdi-logout" @click="signOut" label="Sign out"/>
		<pv-button v-else class="p-button-success" icon="mdi mdi-login" @click="signIn" label="Sign in"/>
		<pv-button class="p-button-info" icon="mdi mdi-cog" @click="test" label="Test"/>
	</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue"
import { signInWithGoogle, signOut } from "@/auth";

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
		helloMsg() {
			return `Welcome to Your Vue.js App, ${this.$store.state.user.displayName}`;
		},
	},
	methods: {
		signIn() {
			signInWithGoogle().then(() => {
				const msg = `Successfully signed in as ${this.$store.state.user.email}`;
				this.$toast.add({severity: "success", summary: msg, life: 3000,});
				// alert(msg);
				this.$router.push("/about");
			});
		},
		signOut() {
			signOut().then(() => {
				const msg = "Successfully signed out";
				this.$toast.add({severity: "warn", summary: msg, life: 3000,});
				// alert(msg);
			});
		},
		test() {
			this.$toast.add({severity: "success", summary: "Yadda Boo", life: 3000,});
		},
	},
}
</script>
<!-- vim: set sw=4 ts=4 noet list: -->
