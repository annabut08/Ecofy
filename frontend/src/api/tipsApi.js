import axios from "axios";

const API = "https://ecofy-beta.vercel.app";

export const tipsApi = {
  getTips: (category) =>
    axios.get(`${API}/tips/`, {
      params: category ? { category } : {},
    }),

  getCategories: () =>
    axios.get(`${API}/tips/categories`),
};