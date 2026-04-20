/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "*.vercel.app" },
      { protocol: "https", hostname: "*.railway.app" },
      { protocol: "https", hostname: "*.onrender.com" },
    ],
  },
};

export default nextConfig;
