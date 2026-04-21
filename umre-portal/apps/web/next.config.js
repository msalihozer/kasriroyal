/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'api.kasriroyal.com' },
            { protocol: 'https', hostname: 'www.kasriroyal.com' },
            { protocol: 'https', hostname: 'kasriroyal.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'http', hostname: 'localhost' }
        ],
    },
    env: {
        API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:4000/api',
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.kasriroyal.com',
    },
};

module.exports = nextConfig;
