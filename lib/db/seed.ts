import { getDb } from "./index";
import { admins } from "./schema";
import { hashPassword } from "../auth";

export async function forceSeedAdmin() {
  const db = await getDb();
  const hash = await hashPassword("BlackBazaar2026!Secure");
  await db.insert(admins).values({
    id: crypto.randomUUID(),
    email: "admin@blackbazaar.com",
    passwordHash: hash
  }).onConflictDoNothing();
}
