/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'images.unsplash.com', 'api.kasriroyal.com'],
    },
    env: {
        API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:4000/api',
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.kasriroyal.com',
    },
};

module.exports = nextConfig;
