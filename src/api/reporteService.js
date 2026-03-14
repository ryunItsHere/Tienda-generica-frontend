import axiosClient from "./axiosClient";

export const reporteService = {
  getVentas: () => axiosClient.get("/reportes/ventas"),
  getVentasPDF: () =>
    axiosClient.get("/reportes/ventas?formato=pdf", { responseType: "blob" }),
  getTotalGeneral: () => axiosClient.get("/reportes/total-general"),
  getTotalPDF: () =>
    axiosClient.get("/reportes/total-general?formato=pdf", {
      responseType: "blob",
    }),
  porCliente: (cedula) => axiosClient.get(`/reportes/ventas/${cedula}`),
  porClientePDF: (cedula) =>
    axiosClient.get(`/reportes/ventas/${cedula}?formato=pdf`, {
      responseType: "blob",
    }),
};
