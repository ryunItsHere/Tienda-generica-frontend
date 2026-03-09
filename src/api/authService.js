import axiosClient from "./axiosClient";

const authService = {
  login: (username, password) =>
    axiosClient.post("/auth/login", { username, password }),
};

export default authService;
