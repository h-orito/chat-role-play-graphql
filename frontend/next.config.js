/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/chat-role-play',
    images: {
        domains: [
            'placehold.jp', // TODO: 後ほど削除
            "pub-2a23cff1d28a4ec080c91e5368fd2606.r2.dev"
        ]
    }
}

module.exports = nextConfig
