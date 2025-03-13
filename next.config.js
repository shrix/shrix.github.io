/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  basePath: '/chat',
  assetPrefix: '/chat/',  // assetPrefix requires the trailing slash
  images: {
    unoptimized: true,
  },
  // This is needed for GitHub Pages to work with Next.js
  trailingSlash: true,
}

module.exports = nextConfig 