import { defineConfig } from "vite"

import react from "@vitejs/plugin-react"

import tailwindcss from "@tailwindcss/vite"

import path from "node:path"

import { fileURLToPath } from "node:url"

const __dirname =
  path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2022",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {

          if (!id.includes("node_modules")) return

          if (id.includes("monaco-editor")) {

            return "monaco"
          }

          if (id.includes("mermaid")) {

            return "mermaid"
          }

          if (id.includes("framer-motion")) {

            return "motion"
          }

          if (
            id.includes("@google/generative-ai") ||
            id.includes("axios")
          ) {

            return "data"
          }

          return "vendor"
        },
      },
    },
  },
})