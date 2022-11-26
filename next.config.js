/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "cdn.pixabay.com",
      "firebasestorage.googleapis.com",
      "afbase-7ee60.appspot.com",
      "wakanda-business.appspot.com",
      "upload.wikimedia.org",
    ],
  },
};

module.exports = nextConfig;
