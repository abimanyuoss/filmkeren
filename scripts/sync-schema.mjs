import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const sql = neon(databaseUrl);
const script = await readFile(join(process.cwd(), "database", "schema.sql"), "utf8");
const statements = script
  .split(/;\s*(?:\r?\n|$)/)
  .map((statement) => statement.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
}

await sql.query(`
  update admin_users
  set email = 'admin@gmail.com', updated_at = now()
  where id = 'user-abimanyu' or lower(name) = 'abimanyu panji'
`);

console.log("Schema synchronized without running seed.");
