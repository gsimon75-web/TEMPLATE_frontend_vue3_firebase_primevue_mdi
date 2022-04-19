import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
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
		name: "home",
		component: HomeView,
	},
	{
		path: "/about",
		name: "about",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
		beforeEnter: checkIfLoggedIn,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router;
// vim: set sw=4 ts=4 indk= list noet:
