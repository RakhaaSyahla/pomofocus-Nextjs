// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Beritahu Next.js untuk membuat folder 'out' statis
  output: 'export',
  
  // 2. Beritahu Next.js bahwa alamatnya akan ada di sub-folder
  basePath: '/pomofocus-Nextjs',

  // 3. Matikan optimasi gambar (wajib untuk 'output: export')
  images: {
    unoptimized: true,
  },
};

export default nextConfig;