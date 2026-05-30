/** @type {import('next').Config} */
// Keep config minimal for Vercel/Turbopack builds. Removing absolute
// outputFileTracingRoot which can point outside the project and cause
// Turbopack "Invalid distDirRoot" errors during production builds.
const nextConfig = {
  // add custom config here if needed
};

module.exports = nextConfig;
