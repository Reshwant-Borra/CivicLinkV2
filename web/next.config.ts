import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* `postgres` (postgres.js) is pure JS and bundles cleanly. Avoid listing it under
   * `serverExternalPackages` with Turbopack on Windows — junction creation can fail (os error 80). */

  // Pin Turbopack's workspace root to the `web/` directory so it doesn't scan the
  // repo-root `package-lock.json` as a second lockfile. Without this, Turbopack
  // allocates ~2x the memory and can exhaust the Node heap on Windows machines
  // with limited RAM or a small paging file (os error 1455 / 1450).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
