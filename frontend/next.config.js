/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
    basePath: '/chat-role-play',
    images: {
        domains: [
            "pub-2a23cff1d28a4ec080c91e5368fd2606.r2.dev",
            "wolfort.net",
            "image.wolfort.dev"
        ]
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
}

module.exports = nextConfig
