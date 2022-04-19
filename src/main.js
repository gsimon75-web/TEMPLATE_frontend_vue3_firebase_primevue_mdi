import { createApp } from "vue"

import PrimeVue from "primevue/config";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import Button from "primevue/button";
import Message from "primevue/message";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";

import "@mdi/font/scss/materialdesignicons.scss";
import "@mdi/font/fonts/materialdesignicons-webfont.ttf";

import App from "@/App.vue"
import router from "@/router"
import store from "@/store"

import { initAuth, signInToBackend } from "@/auth";

//Vue.config.productionTip = false;

initAuth().then(signInToBackend).catch(error => {
	console.log(`Could not sign in with persisted data: ${error.message} (this is normal)`);
}).then(() => {
	let app = createApp(App);
	
	app.use(ToastService);

	app.use(PrimeVue);
	app.component("Button", Button);
	app.component("Message", Message);
	app.component("Toast", Toast);

	app.use(store);
	app.use(router);
	app.mount("#app")
});

// vim: set sw=4 ts=4 indk= list noet:
