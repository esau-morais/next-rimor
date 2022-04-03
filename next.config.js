/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['rickandmortyapi.com']
  },
  experimental: {
    runtime: 'nodejs',
  },
}

module.exports = nextConfig
