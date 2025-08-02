import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'esbuild'
    },
    publicDir: 'public',
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
});