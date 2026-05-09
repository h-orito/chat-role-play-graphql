import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  basePath: '/chat-role-play',
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
    includePaths: [path.join(process.cwd(), 'styles')],
  },
}

export default nextConfig
