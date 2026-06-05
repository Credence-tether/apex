// audit-old-schema.js
const fs = require("fs");
const path = require("path");

// Directories to scan
const TARGET_DIRS = ["app", "pages", "components", "hooks", "lib", "src"];
// Extensions to check
const FILE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

const OLD_PATTERNS = [
  { name: "Deposit Table", regex: /\bapex_deposit_requests\b/g },
  { name: "Withdrawal Table", regex: /\bapex_withdrawals\b/g },
  { name: "Investment Table", regex: /\bapex_investments\b/g },
  { name: "Loan Table", regex: /\bapex_loans\b/g },
  { name: "Transaction Table", regex: /\bapex_transactions\b/g },
  { name: "User Role Column", regex: /\buser_role\b/g },
  {
    name: "Legacy Profile Query (user_id)",
    regex: /\.eq\(\s*['"]user_id['"]\s*,/g,
  },
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  let fileHasMatches = false;

  lines.forEach((line, index) => {
    OLD_PATTERNS.forEach((pattern) => {
      if (pattern.regex.test(line)) {
        if (!fileHasMatches) {
          console.log(`\n\x1b[33m[MATCHFOUND] File: ${filePath}\x1b[0m`);
          fileHasMatches = true;
        }
        console.log(
          `  -> Line ${index + 1}: \x1b[36m${pattern.name}\x1b[0m -> "${line.trim()}"`,
        );
      }
      // Reset regex index state for global flags
      pattern.regex.lastIndex = 0;
    });
  });
}

function traverseDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !["node_modules", ".next"].includes(file)) {
      traverseDirectory(fullPath);
    } else if (stat.isFile() && FILE_EXTENSIONS.includes(path.extname(file))) {
      scanFile(fullPath);
    }
  });
}

console.log(
  "\x1b[35mStarting deep-scan audit for legacy database patterns...\x1b[0m",
);
TARGET_DIRS.forEach((dir) => traverseDirectory(path.join(process.cwd(), dir)));
console.log("\n\x1b[32mScan complete.\x1b[0m");
