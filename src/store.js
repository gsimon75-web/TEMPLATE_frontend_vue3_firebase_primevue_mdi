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
		idToken: null,
		providerId: null,
	},
	getters: {
	},
	mutations: {
		storeIdToken(state, idToken, providerId) {
			if (idToken !== null) {
				console.log("Signed in with token " + idToken);
			}
			else {
				console.log("Signed out");
			}
			state.idToken = idToken || null;
			state.providerId = providerId || null;
		},
	},
};

export const store = new Vuex.Store({
	state: {
		ax: null,
		reauthInProgress: false,
		appBarInfo: "...",
		now: 0, // current time in Unix systime, updated periodically
		today: 0, // current day start in Unix systime, updated periodically
		user: {},
		$toast: null,
	},
	getters: {
		isLoggedIn(state) {
			return !!state.user.email;
		},
	},
	mutations: {
		setToastService(state, t) {
			state.$toast = t;
		},
		updateNow(state) {
			const now = Math.trunc(new Date().getTime() / 1000);
			state.now = now;
			state.today = Math.trunc(now / SEC_PER_DAY) * SEC_PER_DAY;
		},
		setCurrentUser(state, u) {
			if (u) {
				console.log("Storing user " + JSON.stringify(u));
				state.user = u;
			}
			else {
				console.log("Clearing stored user");
				state.user = {};
			}
		},
		setReauth(state, value) {
			state.reauthInProgress = value;
		},
		setInfo(state, s) {
			state.appBarInfo = s;
		},
	},
	actions: {
	},
	modules: {
		persist,
	},
	plugins: [vuexLocalStorage.plugin],
});

/*var nowUpdateTimer = */ setInterval(() => store.commit("updateNow"), 1000);
export default store;
// vim: set sw=4 ts=4 noet list:
