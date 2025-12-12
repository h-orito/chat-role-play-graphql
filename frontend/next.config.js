/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
    basePath: '/chat-role-play',
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pub-2a23cff1d28a4ec080c91e5368fd2606.r2.dev',
            },
            {
                protocol: 'https',
                hostname: 'wolfort.net',
            },
            {
                protocol: 'https',
                hostname: 'image.wolfort.dev',
            },
        ],
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
}

module.exports = nextConfig
