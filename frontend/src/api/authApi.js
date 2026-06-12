import axios from "axios";

const API = "https://ecofy-beta.vercel.app";

export const authApi = {
  login: (email, password) => {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);
    return axios.post(`${API}/auth/login`, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  },
};