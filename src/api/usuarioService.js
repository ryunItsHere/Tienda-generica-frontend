import axiosClient from "./axiosClient";

export const usuarioService = {
  getAll: () => axiosClient.get("/usuarios/listar"),
  create: (data) => axiosClient.post("/usuarios/crear", data),
  update: (cedula, data) =>
    axiosClient.put(`/usuarios/actualizar/${cedula}`, data),
  toggleEstado: (cedula) => axiosClient.patch(`/usuarios/estado/${cedula}`),
  getById: (cedula) => axiosClient.get(`/usuarios/buscar/${cedula}`),
};
