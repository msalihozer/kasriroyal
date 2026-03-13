/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'images.unsplash.com', 'api.kasriroyal.com'],
    },
    env: {
        API_BASE_URL: 'http://localhost:4000/api',
    },
};

module.exports = nextConfig;
