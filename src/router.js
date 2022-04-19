import { createRouter, createWebHistory } from "vue-router";
import About from "@/views/About.vue";
import PageOne from "@/views/PageOne.vue";
import { store } from "@/store";


function checkIfLoggedIn() {
	if (store.getters.isLoggedIn) {
		return true;
	}
	store.state.$toast.add({severity: "error", summary: "Please sign in first!", life: 3000,});
	return false;
}

export const routes = [
	{
		path: "/",
		name: "about",
		component: About,
	},
	{
		path: "/page-one",
		name: "page-one",
		component: PageOne,
		beforeEnter: checkIfLoggedIn,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router;
// vim: set sw=4 ts=4 indk= list noet:
