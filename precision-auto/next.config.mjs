/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["precision-auto-online-estimates.s3.amazonaws.com"], // add your S3 bucket domain
  },
};

export default nextConfig;
