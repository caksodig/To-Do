// import axios from "axios";

// const baseURL = "https://fe-test-api.nwappservice.com";

// export const api = axios.create({
//   baseURL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
// function getTokenFromCookie() {
//   return document.cookie
//     .split("; ")
//     .find((row) => row.startsWith("token="))
//     ?.split("=")[1];
// }

// api.interceptors.request.use((config) => {
//   const token = getTokenFromCookie();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

import axios from "axios";
import { useAuthStore } from "@/store/authStore"; // perhatikan path ini sesuai strukturmu

const baseURL = "https://fe-test-api.nwappservice.com";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // ambil langsung dari localStorage Zustand persist
  const raw = localStorage.getItem("auth-storage");
  const token = raw ? JSON.parse(raw)?.state?.token : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
