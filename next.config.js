/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  // Fix asset paths for GitHub Pages
  basePath: '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  images: {
    unoptimized: true,
  },
  // This is needed for GitHub Pages to work with Next.js
  trailingSlash: true,
}

module.exports = nextConfig 