// Seed admin script — run once to create initial admin
// Usage: npx tsx scripts/seed-admin.ts

import { hashPassword } from "../lib/auth";

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@blackbazaar.com";
  const password = process.env.ADMIN_PASSWORD || "BlackBazaar2026!Secure";

  const passwordHash = await hashPassword(password);
  const id = crypto.randomUUID();

  // Output SQL for manual insertion via wrangler d1 execute
  const sql = `INSERT INTO admins (id, email, password_hash) VALUES ('${id}', '${email}', '${passwordHash}');`;

  console.log("\n=== SEED ADMIN ===");
  console.log(`Email: ${email}`);
  console.log(`ID: ${id}`);
  console.log("\nRun this command to seed the admin:");
  console.log(`wrangler d1 execute blackbazaar-db --local --command="${sql}"`);
  console.log(`\nFor production:`);
  console.log(`wrangler d1 execute blackbazaar-db --remote --command="${sql}"`);
  console.log("\n==================\n");
}

main().catch(console.error);
