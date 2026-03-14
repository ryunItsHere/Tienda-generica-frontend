import axiosClient from "./axiosClient";

export const productoService = {
  getAll: () => axiosClient.get("/productos/listar"),
  create: (data) => axiosClient.post("/productos/guardar", data),
  update: (codigo, data) =>
    axiosClient.put(`/productos/actualizar/${codigo}`, data),
  delete: (codigo) => axiosClient.delete(`/productos/eliminar/${codigo}`),
  getById: (codigo) => axiosClient.get(`/productos/buscar/${codigo}`),
  uploadCSV: (formData) =>
    axiosClient.post("/productos/cargar-csv", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
