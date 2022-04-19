<template>
<div class="about">
	<img alt="Vue logo" src="../assets/logo.png">
	<HelloWorld :msg="helloMsg"/>
	<Button class="p-button-info" icon="mdi mdi-cog" @click="test" label="Test"/>
</div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";

export default {
	name: "About",
	components: {
		HelloWorld,
	},
	data() {
		return {
		};
	},
	computed: {
		helloMsg() {
			return `Welcome to Your Vue.js App, ${this.$store.state.user.displayName || "Guest"}`;
		},
	},
	methods: {
		test() {
			this.$toast.add({severity: "success", summary: "Yadda Boo", life: 3000,});
		},
	},
};
</script>
<!-- vim: set sw=4 ts=4 noet list: -->
