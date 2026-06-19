/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lambda.ai',
      },
    ],
  },
};

export default nextConfig;
