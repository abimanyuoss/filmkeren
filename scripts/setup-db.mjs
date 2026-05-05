import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required. Copy .env.example to .env and add your Neon connection string.");
  process.exit(1);
}

const sql = neon(databaseUrl);
const root = process.cwd();

for (const file of ["schema.sql", "seed.sql"]) {
  const script = await readFile(join(root, "database", file), "utf8");
  const statements = script
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await sql.query(statement);
  }

  console.log(`Applied database/${file}`);
}

console.log("Neon database is ready.");
