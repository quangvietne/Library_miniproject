import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
// defineConfig({
//   plugins: [react()],
//   root: "public", // Đảm bảo root là thư mục chứa index.html
//   server: {
//     port: 5173,
//     host: "0.0.0.0", // Thêm dòng này để expose
//     open: true, // Tự động mở browser
//     proxy: {
//       "/api": {
//         target: "http://localhost:5000",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });
