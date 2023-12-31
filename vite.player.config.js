// /vite.config.js
import react from "@vitejs/plugin-react";
import { defineConfig } from 'vite'
import path, { extname } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
    ],
    server: {
        host: '0.0.0.0',
        hmr: {
            clientPort: 443
        },
        port: 8090,
        proxy: {
            '/v1': {
                target: 'https://prev2.d8dcloud.com',
                changeOrigin: true,
            },
            '/api': {
                target: 'https://prev2.d8dcloud.com',
                changeOrigin: true,
            },
        }
    },
    define: {
        'process.env': process.env,

    },
    // 打包配置 npm run build
    build: {
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            },
            format: {
                comments: false,
                beautify: false
            }
        },
        rollupOptions: {
            input: {//可以配置多个，表示多入口
                index: path.resolve(__dirname, "player/build.html"),
            },
            output: {
                manualChunks: {
                    // nutui: ['@nutui/nutui-react'],
                    // antd: ['antd'],
                    // WangEditor: [path.resolve(__dirname, "src/player/Wangeditor")],
                    reactResponsive: ['react-responsive'],
                },
            },
        },
        outDir: '../dist/player',
        emptyOutDir: true
    },
    root: './player',
    //base: '/',
    base: 'https://d8dprev2.y2o.me/',
})
