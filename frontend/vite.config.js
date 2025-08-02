import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        rollupOptions: {
            external: ['@rollup/rollup-linux-x64-gnu']
        }
    },
    optimizeDeps: {
        exclude: ['@rollup/rollup-linux-x64-gnu']
    }
}); 