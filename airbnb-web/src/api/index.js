import axios from "axios";

const API = axios.create();

export const initialFetch = () => API.get("/message");
