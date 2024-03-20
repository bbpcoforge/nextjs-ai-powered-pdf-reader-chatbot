/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.externals = [...config.externals, "faiss-node"];

    return config;
  },
};

export default nextConfig;
