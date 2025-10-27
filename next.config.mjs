// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  // INI WAJIB ADA SAAT DEPLOY
  basePath: "/pomofocus-Nextjs",

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
