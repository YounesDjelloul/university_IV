export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    css: ['~/assets/css/tailwind.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    app: {
        baseURL: '/university_IV/'
    },
    nitro: {
        preset: 'github_pages'
    },
})
