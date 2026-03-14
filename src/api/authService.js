import axiosClient from "./axiosClient";

export const authService = {
  login: (username, password) =>
    axiosClient.post("/auth/login", { username, password }),
};
