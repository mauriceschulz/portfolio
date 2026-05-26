import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/css/chess.css',
                'resources/js/app.js',
                'resources/js/chess-page.js',
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        proxy: {
            '/api': 'http://localhost:8080',
        },
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
