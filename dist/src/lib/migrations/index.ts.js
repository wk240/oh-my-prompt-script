function semverCompare(a, b) {
  const parseVersion = (v) => {
    const parts = v.split(".").map(Number);
    return { major: parts[0] || 0, minor: parts[1] || 0 };
  };
  const va = parseVersion(a);
  const vb = parseVersion(b);
  if (va.major !== vb.major) return va.major - vb.major;
  return va.minor - vb.minor;
}
const migrations = [];
export function registerMigration(step) {
  migrations.push(step);
  migrations.sort((a, b) => semverCompare(a.version, b.version));
}
export function isLegacyFormat(data) {
  if (!data || typeof data !== "object") return false;
  const obj = data;
  return Array.isArray(obj.prompts) && Array.isArray(obj.categories) && !obj.userData;
}
export async function migrate(oldData, targetVersion) {
  if (oldData && typeof oldData === "object") {
    const obj = oldData;
    if (obj._migrationComplete === true) {
      return oldData;
    }
  }
  let startVersion = "1.0";
  if (oldData && typeof oldData === "object") {
    const obj = oldData;
    if (typeof obj.version === "string") {
      startVersion = obj.version;
    }
  }
  const steps = migrations.filter(
    (m) => semverCompare(m.version, startVersion) >= 0 && semverCompare(m.version, targetVersion) < 0
  );
  let data = oldData;
  for (const step of steps) {
    try {
      console.log(`[Oh My Prompt Script] Executing migration ${step.version}`);
      data = step.handler(data);
    } catch (error) {
      console.error(`[Oh My Prompt Script] Migration ${step.version} failed:`, error);
      throw new Error(`Migration to ${targetVersion} failed at step ${step.version}`);
    }
  }
  const result = data;
  result.version = targetVersion;
  result._migrationComplete = true;
  return result;
}
