/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  // Fix asset paths for GitHub Pages
  basePath: '',
  assetPrefix: './',  // Use relative paths for assets
  images: {
    unoptimized: true,
  },
  // This is needed for GitHub Pages to work with Next.js
  trailingSlash: true,
}

module.exports = nextConfig 