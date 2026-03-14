import axiosClient from "./axiosClient";

export const proveedorService = {
  getAll: () => axiosClient.get("/proveedor/getall"),
  create: (data) => axiosClient.post("/proveedor/createjson", data),
  update: (id, data) => axiosClient.put(`/proveedor/updatejson?id=${id}`, data),
  delete: (id) => axiosClient.delete(`/proveedor/deletebyid/${id}`),
  getById: (id) => axiosClient.get(`/proveedor/getbyid/${id}`),
};
