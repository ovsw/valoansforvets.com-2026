import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { previewDatabaseUrl } from "../lib/crm/policy";

export function database() {
  return drizzle(neon(previewDatabaseUrl()));
}
