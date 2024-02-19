/** @type {import('next').NextConfig} */
const path = require('path')

// see https://zenn.dev/duo3/articles/dbb8115309059e
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first")

const nextConfig = {
    basePath: '/chat-role-play',
    images: {
        domains: [
            "pub-2a23cff1d28a4ec080c91e5368fd2606.r2.dev",
            "wolfort.net"
        ]
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
}

module.exports = nextConfig
