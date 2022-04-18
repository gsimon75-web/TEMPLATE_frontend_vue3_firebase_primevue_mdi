import Vuex from "vuex";
import VuexPersist from "vuex-persist";

const vuexLocalStorage = new VuexPersist({
	key: "vuex",
	asyncStorage: false,
	storage: window.localStorage,
	modules: ["persist"],
});

export const SEC_PER_DAY = 24 * 60 * 60;

const persist = { // NOTE: this module will be persisted
	state: {
		id_token: null,
		provider_id: null,
	},
	getters: {
	},
	mutations: {
		store_id_token(state, id_token, provider_id) {
			if (id_token !== null) {
				console.log("Signed in with token " + id_token);
			}
			else {
				console.log("Signed out");
			}
			state.id_token = id_token || null;
			state.provider_id = provider_id || null;
		},
	},
};

export const store = new Vuex.Store({
	state: {
		ax: null,
		reauth_in_progress: false,
		app_bar_info: "...",
		now: 0, // current time in Unix systime, updated periodically
		today: 0, // current day start in Unix systime, updated periodically
		notifications: {}, // { whatever_id: { type: "error", message: "out of luck" }, ...
		user: {},
	},
	getters: {
	},
	mutations: {
		update_now(state) {
			const now = Math.trunc(new Date().getTime() / 1000);
			state.now = now;
			state.today = Math.trunc(now / SEC_PER_DAY) * SEC_PER_DAY;
		},
		set_current_user(state, u) {
			if (u) {
				console.log("Storing user " + JSON.stringify(u));
				state.user = u;
			}
			else {
				console.log("Clearing stored user");
				state.user = {};
			}

		},
		set_reauth(state, value) {
			state.reauth_in_progress = value;
		},
		notify(state, id, type, message) {
			if (type && message) {
				state.notifications[id] = { type, message };
			}
			else {
				delete state.notifications[id];
			}
		},
	},
	actions: {
	},
	modules: {
		persist,
	},
	plugins: [vuexLocalStorage.plugin],
});

/*var now_update_timer = */ setInterval(() => store.commit("update_now"), 1000);
export default store;
// vim: set sw=4 ts=4 noet list:
