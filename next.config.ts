import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
    ],
    domains: ['localhost', 'share-mint.vercel.app', 'share-mint-git-v1-napstar420s-projects.vercel.app'],
  },
}

export default nextConfig
