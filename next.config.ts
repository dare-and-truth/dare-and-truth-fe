import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bbekctirwxonkfdomiii.supabase.co',
        port: '',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
