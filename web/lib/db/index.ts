import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

type Sql = ReturnType<typeof postgres>;

const globalForPg = globalThis as unknown as {
  __civiclinkPostgres?: Sql;
  __civiclinkDb?: ReturnType<typeof drizzle<typeof schema>>;
};

/**
 * Returns a Drizzle client when `DATABASE_URL` is set; otherwise `null` (geo still works without DB).
 */
export function getDb() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;

  if (!globalForPg.__civiclinkPostgres) {
    globalForPg.__civiclinkPostgres = postgres(url, {
      max: 3,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    globalForPg.__civiclinkDb = drizzle(globalForPg.__civiclinkPostgres, {
      schema,
    });
  }

  return globalForPg.__civiclinkDb ?? null;
}
