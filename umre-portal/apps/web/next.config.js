/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'images.unsplash.com'],
    },
    env: {
        API_BASE_URL: 'http://localhost:4000/api',
    },
};

module.exports = nextConfig;
