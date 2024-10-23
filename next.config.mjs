/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "export",
  images: {
    domains: [
      "picsum.photos",
      "hola-post-image.s3.ap-northeast-2.amazonaws.com",
    ],
  },
}

export default nextConfig
