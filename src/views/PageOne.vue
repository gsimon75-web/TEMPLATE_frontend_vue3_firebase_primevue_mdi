<template>
<div class="page-one">
	<h1>Here is Page One of your app</h1>
</div>
</template>

<script>
export default {
	name: "PageOne",
	data() {
		return {
		};
	},
	mounted() {
		this.$store.commit("setInfo", "Page One");
	},
};
</script>
<!-- vim: set sw=4 ts=4 noet list: -->
