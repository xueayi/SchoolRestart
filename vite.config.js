/** @type {import('vite').UserConfig} */
export default {
    base: './',
    build: {
        outDir: 'dist',
    },
    server: {
        host: '0.0.0.0',
        port: 4173,
    },
    preview: {
        host: '0.0.0.0',
        port: 4173,
    },
}
