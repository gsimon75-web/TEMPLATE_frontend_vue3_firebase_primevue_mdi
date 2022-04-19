import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { firebaseConfig, backend } from "@/config";
import { store } from "@/store";
import { ax } from "@/ax";

export function initAuth() {
	// https://www.freecodecamp.org/news/how-to-add-authentication-to-a-vue-app-using-firebase/
	// https://blog.logrocket.com/vue-firebase-authentication/
	firebase.initializeApp(firebaseConfig);
	const fbAuth = firebase.auth();
	fbAuth.useDeviceLanguage();
	return fbAuth.setPersistence("local").then(() => {
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

export function signInToBackend() {
	console.log("Signing in to backend");
	store.commit("setReauth", true);

	const user = firebase.auth().currentUser;
	console.log(`firebase user=${JSON.stringify(user)}`);
	if (!user) {
		throw new Error("No current user is set");
	}

	return user.getIdToken(true).then(idToken => {
		store.commit("storeIdToken", idToken, user.providerId);
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
		return ax.get(backend.signInEndpoint, { headers: { Authorization: "Bearer " + store.state.persist.idToken} })
		.then(result => {
			console.log("Signed in to backend, whoami results: " + JSON.stringify(result.data));
			return { ...data, ...result.data };
		});
	}).then(resultData => {
		store.commit("setReauth", false);
		store.commit("setCurrentUser", resultData);
	}).catch(err => {
		console.log("Failed to sign in to backend: " + JSON.stringify(err));
		store.commit("setReauth", false);
		store.commit("storeIdToken", null);
		store.commit("setCurrentUser", {});
		throw err;
	});
}

export function signOut() {
	console.log("signOut()");
	return (backend.signOutEndpoint
		? ax.get(backend.signOutEndpoint).then(() => {
			console.log("Signed out from backend");
		})
		: Promise.resolve()
	)
	.then(() => {
		store.commit("setCurrentUser", null);
		store.commit("storeIdToken", null);
		return firebase.auth().signOut();
	}).catch(error => {
		alert(error.message);
		throw error;
	});
}
export function signInWithGoogle() {
	var provider = new firebase.auth.GoogleAuthProvider();
	provider.setCustomParameters({
		access_type: "offline",
		prompt: "select_account",
	});

	return firebase.auth().signInWithPopup(provider).then(
		signInToBackend
	).then(() => {
		store.commit("setReauth", true);
	}).catch(error => {
		alert(error.message);
		throw error;
	});
}

// Install axios interceptor to re-authenticate in case of 401 or 403 auth failures
ax.interceptors.response.use(
	function (response) {
		return response;
	},
	function (error) {
		// error = {"status":403,"error":{"code":"auth/id-token-expired","message":"Firebase ID token has expired. Get a fresh ID token from your client app and try again. See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token."}}
		// axios intercepted response: {"message":"Request failed with status code 403","name":"Error","stack":"Error: Request failed with status code 403...","config":{"url":"/v0/...","method":"get","headers":{...,"Authorization":"Bearer eyJ..."}, ...,"timeout":0,"withCredentials":true,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN",...}}
		// axios intercepted, error.response: {"data":"","status":403,"statusText":"Firebase ID token has expired...","headers":{...},"config":{"url":"v0/whoami","method":"get","headers":{...,"Authorization":"Bearer eyJh...d6g"},"baseURL":"https://....com",...,"timeout":0,"withCredentials":true,...},"request":{}}
		//console.log("own props of error: " + JSON.stringify(Object.getOwnPropertyNames(error))); // own props of error: ["stack","message","config","request","response","isAxiosError","toJSON"]

		console.log(`axios intercepted, status=${error.response.status}, reauthInProgress=${store.state.reauthInProgress}`);

		if ((error.response.status == 401) && !store.state.reauthInProgress) {
			console.log(`error.response: ${JSON.stringify(error.response)}`);
			console.log("Getting a new cookie and retrying");
			return signInToBackend().then(() => {
				// the sign-in itself has already been processed, otherwise retry it
				return (error.config.url == backend.signInEndpoint) ? Promise.resolve() : ax.request(error.config);
			});
		}

		if ((error.response.status == 403) && error.response.statusText.includes("(auth/id-token-expired)") && !store.state.reauthInProgress) {
			console.log("error.response: " + JSON.stringify(error.response));
			console.log(`Getting a new id token and retrying, providerId='${store.state.persist.providerId}'`);
			//if (store.state.persist.providerId == "google.com") {
			//}
			return signInWithGoogle().then(() => {
				// the sign-in itself has already been processed, otherwise retry it
				return (error.config.url == backend.signInEndpoint) ? Promise.resolve() : ax.request(error.config);
			});
		}

		return Promise.reject(error.response)
	}
);

// vim: set sw=4 ts=4 noet list:
