import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
const original = "C:/Users/Acer/Documents/Codex/2026-08-15/cr";
const status = execFileSync("git", ["status", "--porcelain"], {
  cwd: original,
  encoding: "utf8",
});
if (status.trim())
  throw new Error("Original contains changes; inspect before transfer");
const changed = execFileSync("git", ["diff", "--name-only"], {
  encoding: "utf8",
})
  .trim()
  .split("\n");
const added = execFileSync(
  "git",
  ["ls-files", "--others", "--exclude-standard"],
  { encoding: "utf8" },
)
  .trim()
  .split("\n")
  .filter(
    (p) =>
      /^(app|api|lib|config|scripts|worker)\//.test(p) ||
      /^supabase\/migrations\//.test(p),
  );
const backup = path.resolve("outputs/original-before-transfer");
fs.mkdirSync(backup, { recursive: true });
const hash = (b) => crypto.createHash("sha256").update(b).digest("hex");
const manifest = [];
for (const file of [...new Set([...changed, ...added])]) {
  if (!file || !fs.existsSync(file)) continue;
  const dest = path.join(original, file),
    exists = fs.existsSync(dest);
  if (exists) {
    const data = fs.readFileSync(dest);
    fs.mkdirSync(path.dirname(path.join(backup, file)), { recursive: true });
    fs.writeFileSync(path.join(backup, file), data);
  }
  manifest.push({
    file,
    exists,
    before: exists ? hash(fs.readFileSync(dest)) : null,
    after: hash(fs.readFileSync(file)),
  });
}
fs.writeFileSync(
  "outputs/transfer-manifest.json",
  JSON.stringify(manifest, null, 2),
);
console.log(
  JSON.stringify({
    originalStatus: "clean",
    files: manifest.length,
    overwrites: manifest.filter((f) => f.exists).map((f) => f.file),
    backup,
  }),
);
