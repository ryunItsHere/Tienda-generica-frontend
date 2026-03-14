import axiosClient from "./axiosClient";

export const clienteService = {
  getAll: () => axiosClient.get("/clientes/listar"),
  create: (data) => axiosClient.post("/clientes/crear", data),
  update: (cedula, data) =>
    axiosClient.put(`/clientes/actualizar/${cedula}`, data),
  delete: (cedula) => axiosClient.delete(`/clientes/eliminar/${cedula}`),
  getById: (cedula) => axiosClient.get(`/clientes/buscar/${cedula}`),
};
