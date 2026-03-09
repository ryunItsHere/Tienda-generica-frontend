import axiosClient from "./axiosClient";

const productoService = {
  getAll: () => axiosClient.get("/productos"),
  getById: (id) => axiosClient.get(`/productos/${id}`),
  create: (data) => axiosClient.post("/productos", data),
  update: (id, data) => axiosClient.put(`/productos/${id}`, data),
  delete: (id) => axiosClient.delete(`/productos/${id}`),
  uploadCSV: (formData) =>
    axiosClient.post("/productos/cargar-csv", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getByCode: (code) => axiosClient.get(`/productos/codigo/${code}`),
};

export default productoService;
