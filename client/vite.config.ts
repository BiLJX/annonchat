import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'
import fs from 'fs';
import Terminal from 'vite-plugin-terminal'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), Terminal()],

  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  // server: {
  //   https: {
  //     key: fs.readFileSync(path.resolve(__dirname, 'localhost.key')),
  //     cert: fs.readFileSync(path.resolve(__dirname, 'localhost.crt'))
  //   },
  //   host: '0.0.0.0',  // To be accessible from the local network
  //   port: 5173
  // }
})
