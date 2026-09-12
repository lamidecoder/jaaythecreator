/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // No external image host is used out of the box (see /public/media/README.md
    // for how project media is organised). Once real photos or a video CDN such
    // as Cloudinary, Mux, or Bunny are in place, list their hostnames here, e.g:
    // remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
};

export default nextConfig;
