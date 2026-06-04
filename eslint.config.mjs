/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // বিল্ড করার সময় ছোটখাটো লিন্ট এরর ইগনোর করবে
    ignoreDuringBuilds: true,
  },
  typescript: {
    // বিল্ড করার সময় টাইপস্ক্রিপ্ট এরর ইগনোর করবে
    ignoreBuildErrors: true,
  },
};

export default nextConfig;