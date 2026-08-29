// DB helper — Drizzle + D1 via OpenNext bindings (BB-03 §5)

import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

export async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB, { schema });
}

export type DbClient = Awaited<ReturnType<typeof getDb>>;
