import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd());
const repoRootPosix = repoRoot.replaceAll("\\", "/").replace(/\/+$/, "");

const lcovTargets = [
  { file: path.join(repoRoot, "backend", "coverage", "lcov.info"), workspacePrefix: "backend" },
  { file: path.join(repoRoot, "frontend", "coverage", "lcov.info"), workspacePrefix: "frontend" },
];

for (const target of lcovTargets) {
  if (!fs.existsSync(target.file)) {
    continue;
  }

  const raw = fs.readFileSync(target.file, "utf8");
  const lines = raw.split(/\r?\n/);
  const normalized = lines.map((line) => {
    if (!line.startsWith("SF:")) {
      return line;
    }

    let sourcePath = line.slice(3).trim().replaceAll("\\", "/");

    if (sourcePath.toLowerCase().startsWith(repoRootPosix.toLowerCase() + "/")) {
      sourcePath = sourcePath.slice(repoRootPosix.length + 1);
    } else if (
      !sourcePath.startsWith("backend/") &&
      !sourcePath.startsWith("frontend/") &&
      !sourcePath.startsWith("shared/")
    ) {
      sourcePath = `${target.workspacePrefix}/${sourcePath.replace(/^\.\//, "")}`;
    }

    return `SF:${sourcePath}`;
  });

  fs.writeFileSync(target.file, normalized.join("\n"), "utf8");
  console.log(`Normalized LCOV paths in ${path.relative(repoRoot, target.file)}`);
}
