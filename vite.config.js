import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": "http://localhost:8080",
      "/usuarios": "http://localhost:8080",
      "/clientes": "http://localhost:8080",
      "/proveedor": "http://localhost:8080",
      "/productos": "http://localhost:8080",
      "/ventas": "http://localhost:8080",
      "/reportes": "http://localhost:8080",
    },
  },
});
