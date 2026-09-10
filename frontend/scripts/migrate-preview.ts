import { migrate } from "drizzle-orm/neon-http/migrator";
import { database } from "../db/client";

await migrate(database(), { migrationsFolder: "./drizzle" });
console.log("Development database migrations complete.");
