
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep database packages external
  serverExternalPackages: [
    'sequelize',
    'mysql2',
    'pg',
    'pg-hstore',
    'tedious',
    'oracledb',
    'sqlite3',
    'mariadb',
  ],

  // Next.js 16 Turbopack
  turbopack: {},

  // Remote images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // API rewrites
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/files/:path*',
      },
    ];
  },
};

export default nextConfig;
