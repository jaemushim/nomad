/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "picsum.photos",
      "hola-post-image.s3.ap-northeast-2.amazonaws.com",
    ],
  },
}

export default nextConfig
