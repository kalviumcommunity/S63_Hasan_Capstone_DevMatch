import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'esbuild',
        rollupOptions: {
            external: ['@rollup/rollup-linux-x64-gnu', '@rollup/rollup-darwin-x64', '@rollup/rollup-win32-x64-msvc']
        }
    },
    optimizeDeps: {
        exclude: ['@rollup/rollup-linux-x64-gnu', '@rollup/rollup-darwin-x64', '@rollup/rollup-win32-x64-msvc']
    }
}); 