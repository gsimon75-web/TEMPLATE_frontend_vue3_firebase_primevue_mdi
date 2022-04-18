// set up axios
const axios = require("axios");
const http = require("http");
import { backend } from "@/config";

const httpAgent = new http.Agent({ keepAlive: true });

export const ax = axios.create({ httpAgent, withCredentials: true });

ax.defaults.baseURL = backend.baseURL;

export default {
	ax,
}

// vim: set sw=4 ts=4 indk= list noet:
