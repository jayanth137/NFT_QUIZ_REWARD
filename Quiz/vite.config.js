import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            buffer: 'buffer',
            process: 'process/browser',
        },
    },
    define: {
        'process.env': {}, // Define process.env if necessary.
        global: {}, // Define global if required by TonWeb.
    },
});
