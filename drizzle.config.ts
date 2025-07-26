import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

// Load .env
config({ path: '.env' });

// Debugging: check if env is loaded
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);

export default defineConfig({
  schema: "./src/lib/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
