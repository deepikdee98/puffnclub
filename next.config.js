const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  images: {
    domains: ['localhost', 'example.com', '127.0.0.1'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
        pathname: '/uploads/**',
      }
    ],
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config) => {
    // Ensure '@' resolves to the 'src' directory
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  }
};

module.exports = nextConfig;