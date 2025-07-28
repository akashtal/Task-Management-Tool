import { db } from "@/lib/drizzle";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function ensureAdmin() {
  const adminEmail = "admin@admin.com";
  const adminPassword = "admin";
  const existing = await db.select().from(users).where(eq(users.email, adminEmail));
  if (!existing.length) {
    await db.insert(users).values({
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      approved: true,
    });
  }
}