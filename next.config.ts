import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // AVIF first: the optimiser picks the first entry the browser's Accept
    // header matches, so modern browsers get AVIF and everything else falls
    // back to WebP. Order matters here.
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
