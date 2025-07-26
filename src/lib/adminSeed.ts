import { db } from "./drizzle";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";

async function seedAdmin() {
  const email = "admin@admin.com";
  const password = "admin123";
  const role = "admin";
  const approved = true;

  // Check if admin exists
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    console.log("Admin user already exists.");
    return;
  }

  // Hash password
  const hashed = await hash(password, 10);

  // Insert admin user
  await db.insert(users).values({
    email,
    password: hashed,
    role,
    approved,
  });
  console.log("Admin user created.");
}

seedAdmin().then(() => process.exit(0)); 