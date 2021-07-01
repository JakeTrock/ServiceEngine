import axios from "axios";

export const endpoint = "http://localhost:3000";
export const defaultConnect = axios.create({
    baseURL: endpoint,
    headers: {
        "Content-type": "application/json",
    },
});