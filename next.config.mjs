/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['sequelize', 'mysql2'],
  turbopack: {}, // Next 16: `next build` ke liye (webpack config ke saath error nahi aayega)
   // Naya tarika (recommended)
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
  ],
},
  webpack: (config) => {
    config.externals.push({
      'pg-hstore':  'pg-hstore',
      'pg':         'pg',
      'tedious':    'tedious',
      'oracledb':   'oracledb',
      'sqlite3':    'sqlite3',
      'mariadb':    'mariadb',
    });
    return config;
  },
};

export default nextConfig;