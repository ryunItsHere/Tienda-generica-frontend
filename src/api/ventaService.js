import axiosClient from "./axiosClient";

export const ventaService = {
  getAll: () => axiosClient.get("/ventas/listar"),
  create: (data) => axiosClient.post("/ventas/registrar", data),
  getById: (id) => axiosClient.get(`/ventas/buscar/${id}`),
  porCliente: (cedula) => axiosClient.get(`/ventas/cliente/${cedula}`),
};
