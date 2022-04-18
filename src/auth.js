import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { firebaseConfig } from "@/config";
import { store } from "@/store";
import { ax } from "@/ax";
import { backend } from "@/config";

export function init_auth() {
	// https://www.freecodecamp.org/news/how-to-add-authentication-to-a-vue-app-using-firebase/
	// https://blog.logrocket.com/vue-firebase-authentication/
	firebase.initializeApp(firebaseConfig);
	const fb_auth = firebase.auth();
	fb_auth.useDeviceLanguage();
	return fb_auth.setPersistence("local").then(() => {
		// Yes, this is the official way to wait for the plugin to initialize: https://groups.google.com/g/firebase-talk/c/836OyVNd_Yg/m/fCeSAXkcBQAJ
		return new Promise((resolve, reject) => {
			var unsubscribe = firebase.auth().onAuthStateChanged(
				user => {
					unsubscribe();
					if (user) {
						resolve(user);
					}
					else {
						reject({ code: "auth/invalid-user-token", message: "No persistent data to sign in with" });
					}
			}, reject);
		});
	});
}

export function sign_in_to_backend() {
	console.log("Signing in to backend");
	store.commit("set_reauth", true);

	const user = firebase.auth().currentUser;
	console.log(`firebase user=${JSON.stringify(user)}`);
	if (!user) {
		throw new Error("No current user is set");
	}

	return user.getIdToken(true).then(idToken => {
		store.commit("store_id_token", idToken, user.providerId);
		let data = {
			uid: user.uid,
			email: user.email,
			emailVerified: user.emailVerified,
			displayName: user.displayName,
			photoURL: user.photoURL,
		};
		if (!backend.signInEndpoint) {
			return data;
		}
		return ax.get(backend.signInEndpoint, { headers: { Authorization: "Bearer " + store.state.persist.id_token} })
		.then(result => {
			console.log("Signed in to backend, whoami results: " + JSON.stringify(result.data));
			return { ...data, ...result.data };
		});
	}).then(result_data => {
		store.commit("set_reauth", false);
		store.commit("set_current_user", result_data);
	}).catch(err => {
		console.log("Failed to sign in to backend: " + JSON.stringify(err));
		store.commit("set_reauth", false);
		store.commit("store_id_token", null);
		store.commit("set_current_user", {});
		throw err;
	});
}

export function sign_out() {
	console.log("sign_out()");
	return (backend.signOutEndpoint
		? ax.get(backend.signOutEndpoint).then(() => {
			console.log("Signed out from backend");
		})
		: Promise.resolve()
	)
	.then(() => {
		store.commit("set_current_user", null);
		store.commit("store_id_token", null);
		return firebase.auth().signOut();
	}).catch(error => {
		alert(error.message);
		throw error;
	});
}
export function sign_in_with_google() {
	var provider = new firebase.auth.GoogleAuthProvider();
	provider.setCustomParameters({
		access_type: "offline",
		prompt: "select_account",
	});

	return firebase.auth().signInWithPopup(provider).then(
		sign_in_to_backend
	).then(() => {
		store.commit("set_reauth", true);
	}).catch(error => {
		alert(error.message);
		throw error;
	});
}

// vim: set sw=4 ts=4 noet list:
