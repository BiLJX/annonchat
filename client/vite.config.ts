import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'
import Terminal from 'vite-plugin-terminal'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), Terminal()],

  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
})
