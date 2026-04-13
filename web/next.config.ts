import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* `postgres` (postgres.js) is pure JS and bundles cleanly. Avoid listing it under
   * `serverExternalPackages` with Turbopack on Windows — junction creation can fail (os error 80). */
};

export default nextConfig;
