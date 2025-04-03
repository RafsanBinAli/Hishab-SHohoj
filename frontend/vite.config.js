import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    host: '0.0.0.0', // Ensures the server binds to all available network interfaces
    open: true,       // Automatically open the app in the browser
    port: 3000,       // Port for the dev server
  },
});

