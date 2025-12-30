import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 1. صور Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // 2. صور Unsplash
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      // 3. صور جوجل (Google Auth)
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      // 4. صور أمازون (عشان البيانات الوهمية تظهر)
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      // 5. [الجديد] صور Supabase Storage (الخاصة بمشروعك)
      {
        protocol: 'https',
        hostname: 'kgnhowgllfabxipmkmug.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;