import api from "./api";

export const login = (username, password) =>
  api.post("/auth/login", { username, password }).then((res) => res.data);

export const register = (username, password) =>
  api.post("/auth/register", { username, password }).then((res) => res.data);
