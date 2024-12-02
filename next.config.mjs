/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['cbo-pic-storage.s3.amazonaws.com'],  // Add your S3 bucket domain here
    },
  };

export default nextConfig;
