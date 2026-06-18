import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth"
});

export const login = (email, password) => API.post("/login", { email, password });
export const register = (email, password) => API.post("/register", { email, password });
