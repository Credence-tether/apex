// apply-new-schema.js
const fs = require("fs");
const path = require("path");

const TARGET_DIRS = ["app", "pages", "components", "hooks", "lib", "src"];
const FILE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

// Smart transformations mapping legacy syntax cleanly into v3 architecture
const REPLACEMENTS = [
  {
    desc: "Migrate deposits and append request type filters",
    search: /\.from\(\s*['"]apex_deposit_requests['"]\s*\)/g,
    replace: ".from('apex_master_requests').eq('request_type', 'deposit')",
  },
  {
    desc: "Migrate withdrawals and append type logic",
    search: /\.from\(\s*['"]apex_withdrawals['"]\s*\)/g,
    replace: ".from('apex_master_requests').eq('request_type', 'withdrawal')",
  },
  {
    desc: "Migrate investments and append configuration metrics",
    search: /\.from\(\s*['"]apex_investments['"]\s*\)/g,
    replace:
      ".from('apex_master_requests').eq('request_type', 'investment_purchase')",
  },
  {
    desc: "Migrate loan tables into requests framework",
    search: /\.from\(\s*['"]apex_loans['"]\s*\)/g,
    replace: ".from('apex_master_requests').eq('request_type', 'loan_request')",
  },
  {
    desc: "Rename role column key configurations",
    search: /\buser_role\b/g,
    replace: "role",
  },
];

function refactorFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let hasChanges = false;
  const originalContent = content;

  REPLACEMENTS.forEach(({ search, replace, desc }) => {
    if (search.test(content)) {
      content = content.replace(search, replace);
      console.log(`  Applied: ${desc}`);
      hasChanges = true;
    }
    search.lastIndex = 0; // Reset global regex tracker state
  });

  // Structural context warning edge-case: profiles table queries
  // changing filter parameters from .eq('user_id') to .eq('id')
  if (
    /\.from\(\s*['"]profiles['"]\s*\)/g.test(content) &&
    /\.eq\(\s*['"]user_id['"]/g.test(content)
  ) {
    console.log(
      `  \x1b[31m[WARNING] Manual check recommended in file for Profile filter swap (user_id -> id).\x1b[0m`,
    );
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`\x1b[32m[MODIFIED] ${filePath}\x1b[0m\n`);
  }
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
      refactorFile(fullPath);
    }
  });
}

console.log("\x1b[34mExecuting database client refactoring engine...\x1b[0m\n");
TARGET_DIRS.forEach((dir) => traverseDirectory(path.join(process.cwd(), dir)));
console.log("\x1b[32mRefactoring operation completed.\x1b[0m");
