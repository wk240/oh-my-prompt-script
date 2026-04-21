import { registerMigration } from "/src/lib/migrations/index.ts.js";
import { v1_0Migration } from "/src/lib/migrations/v1.0.ts.js";
export function registerAllMigrations() {
  registerMigration(v1_0Migration);
}
registerAllMigrations();
