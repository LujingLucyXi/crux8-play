/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Apple requires the app-site-association file served as application/json.
  async headers() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },
};
module.exports = nextConfig;
