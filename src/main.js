import { createApp } from "vue"
import App from "@/App.vue"

import router from "@/router"
import store from "@/store"

import { init_auth, sign_in_to_backend } from "@/auth";

//Vue.config.productionTip = false;

init_auth().then(sign_in_to_backend).catch(error => {
	console.log(`Could not sign in with persisted data: ${error.message} (this is normal)`);
}).then(() => {
	createApp(App).use(store).use(router).mount("#app")
});

// vim: set sw=4 ts=4 indk= list noet:
