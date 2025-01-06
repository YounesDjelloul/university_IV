module.exports = {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2c3e50',
                secondary: '#3498db',
                accent: '#e74c3c',
                success: '#27ae60',
                warning: '#f1c40f',
                danger: '#c0392b',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}