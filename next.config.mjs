/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", 'res.cloudinary.com', "i.imgur.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: ""
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
        port: ""
      },
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
        port: ""
      }
    ]
  }
};

export default nextConfig;
